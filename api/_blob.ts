import { put } from '@vercel/blob';

export async function uploadBytes(
  pathname: string,
  bytes: Uint8Array,
  contentType: string,
): Promise<string> {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token) {
    throw new Error('BLOB_READ_WRITE_TOKEN is not configured. Enable Vercel Blob and add the env var.');
  }
  const result = await put(pathname, bytes as unknown as Buffer, {
    access: 'public',
    contentType,
    token,
    addRandomSuffix: true,
  });
  return result.url;
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
