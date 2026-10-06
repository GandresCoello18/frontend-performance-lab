import { cachedGet } from './cache.ts';

export async function getJson<T>(
  url: string,
  options?: { signal?: AbortSignal; timeoutMs?: number; skipCache?: boolean },
): Promise<T> {
  return cachedGet(url, () => fetchWithTimeout<T>(url, options), {
    skipCache: options?.skipCache,
  });
}

async function fetchWithTimeout<T>(
  url: string,
  options?: { signal?: AbortSignal; timeoutMs?: number },
): Promise<T> {
  const timeout = options?.timeoutMs ?? 8000;
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeout);
  options?.signal?.addEventListener('abort', () => ctrl.abort(), { once: true });
  try {
    const response = await fetch(url, { signal: ctrl.signal });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} ${url}`);
    }
    return (await response.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

export function debounce(fn: (value: string) => void, ms: number): (value: string) => void {
  let handle: ReturnType<typeof setTimeout> | undefined;
  return (value: string) => {
    clearTimeout(handle);
    handle = setTimeout(() => fn(value), ms);
  };
}
