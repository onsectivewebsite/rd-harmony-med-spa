import { useCallback, useEffect, useState } from 'react';
import type { Service } from '../../types';

/**
 * Payload accepted by `saveService`/`setActive`.
 *
 * The admin `service-save` API accepts a superset of the public `Service`
 * shape (e.g. `active`, `sortOrder`) that isn't part of the public-facing
 * `Service` type. The server-side `ServiceInput` type that models this
 * superset lives in `api/_content.ts`, which is not importable from the
 * frontend bundle, so we declare a small local extension here instead.
 * `id` may be an empty string to request server-side id generation for a
 * brand-new service.
 */
export type ServicePayload = Service & {
  active?: boolean;
  sortOrder?: number;
};

export interface UseAdminContentResult {
  /** null = not yet loaded / unknown. true/false once `refresh()` has run. */
  seeded: boolean | null;
  services: Service[];
  loading: boolean;
  error: string;
  /** GET service-list; refreshes `services` and derives `seeded`. */
  refresh: () => Promise<void>;
  /** POST seed-content (idempotent), then refresh. The only way content gets seeded. */
  activate: () => Promise<void>;
  /** POST service-save with the given payload, then refresh. Returns the saved service, or null on failure. */
  saveService: (service: ServicePayload) => Promise<Service | null>;
  /**
   * Toggle a service's active flag by re-saving it with `active` merged in.
   * Signature takes the full service object (not just its id) because the
   * save endpoint upserts the whole row.
   */
  setActive: (service: Service, active: boolean) => Promise<void>;
  /** POST service-delete. `hard` is caller-controlled; false = soft delete (deactivate), true = permanent. */
  remove: (id: string, hard: boolean) => Promise<void>;
  /** Reads the file as base64, uploads it, and returns the resulting URL. */
  uploadImage: (file: File) => Promise<string>;
}

function authHeaders(token: string | null, withJson: boolean): HeadersInit {
  const headers: Record<string, string> = { Authorization: `Bearer ${token ?? ''}` };
  if (withJson) headers['Content-Type'] = 'application/json';
  return headers;
}

function readFileAsBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(reader.error || new Error('Failed to read file'));
    reader.onload = () => {
      const result = String(reader.result || '');
      const commaIndex = result.indexOf(',');
      resolve(commaIndex >= 0 ? result.slice(commaIndex + 1) : result);
    };
    reader.readAsDataURL(file);
  });
}

export function useAdminContent(token: string | null): UseAdminContentResult {
  const [seeded, setSeeded] = useState<boolean | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const refresh = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?action=service-list', {
        headers: authHeaders(token, false),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Failed to load services.');
        return;
      }
      const list = (Array.isArray(data.services) ? data.services : []) as Service[];
      setServices(list);
      setSeeded(list.length > 0);
    } catch {
      setError('Network error loading services.');
    } finally {
      setLoading(false);
    }
  }, [token]);

  const activate = useCallback(async (): Promise<void> => {
    if (!token) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?action=seed-content', {
        method: 'POST',
        headers: authHeaders(token, false),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Failed to activate content.');
        return;
      }
      await refresh();
    } catch {
      setError('Network error activating content.');
    } finally {
      setLoading(false);
    }
  }, [token, refresh]);

  const saveService = useCallback(async (service: ServicePayload): Promise<Service | null> => {
    if (!token) {
      setError('Not authenticated.');
      return null;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?action=service-save', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify(service),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Failed to save service.');
        return null;
      }
      await refresh();
      return (data.service ?? null) as Service | null;
    } catch {
      setError('Network error saving service.');
      return null;
    } finally {
      setLoading(false);
    }
  }, [token, refresh]);

  const setActive = useCallback(async (service: Service, active: boolean): Promise<void> => {
    await saveService({ ...service, active });
  }, [saveService]);

  const remove = useCallback(async (id: string, hard: boolean): Promise<void> => {
    if (!token) {
      setError('Not authenticated.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/admin?action=service-delete', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ id, hard }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Failed to delete service.');
        return;
      }
      await refresh();
    } catch {
      setError('Network error deleting service.');
    } finally {
      setLoading(false);
    }
  }, [token, refresh]);

  const uploadImage = useCallback(async (file: File): Promise<string> => {
    if (!token) {
      setError('Not authenticated.');
      return '';
    }
    setLoading(true);
    setError('');
    try {
      const dataBase64 = await readFileAsBase64(file);
      const res = await fetch('/api/admin?action=image-upload', {
        method: 'POST',
        headers: authHeaders(token, true),
        body: JSON.stringify({ filename: file.name, contentType: file.type, dataBase64 }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data?.success) {
        setError(data?.message || 'Failed to upload image.');
        return '';
      }
      return (data.url ?? '') as string;
    } catch {
      setError('Network error uploading image.');
      return '';
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    if (!token) return;
    refresh();
    // Only re-run when the token itself changes (e.g. login/logout); `refresh`
    // is stable across renders because it only depends on `token`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return { seeded, services, loading, error, refresh, activate, saveService, setActive, remove, uploadImage };
}
