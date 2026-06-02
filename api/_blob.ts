import { put, get } from '@vercel/blob';

function blobToken(): string {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Enable Vercel Blob and add the env var.');
  }
  return token;
}

export async function uploadBytes(
  pathname: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  const result = await put(pathname, bytes as unknown as Buffer, {
    access: 'private',
    contentType,
    token: blobToken(),
    addRandomSuffix: true,
  });
  return result.url;
}

export interface FetchedBlob {
  bytes: Buffer;
  contentType: string;
}

// Reads a private blob server-side using the store token. The stored URL is not
// publicly accessible (private store), so files are streamed back through an
// authenticated API route rather than linked directly.
export async function fetchBlob(urlOrPathname: string): Promise<FetchedBlob | null> {
  const result = await get(urlOrPathname, { access: 'private', token: blobToken() });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const reader = result.stream.getReader();
  const chunks: Uint8Array[] = [];
  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    if (value) chunks.push(value);
  }
  return {
    bytes: Buffer.concat(chunks),
    contentType: result.blob.contentType || 'application/octet-stream',
  };
}

export function decodeDataUrl(dataUrl: string): { mime: string; bytes: Uint8Array } | null {
  const m = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl);
  if (!m) return null;
  try {
    return { mime: m[1], bytes: new Uint8Array(Buffer.from(m[2], 'base64')) };
  } catch {
    return null;
  }
}
