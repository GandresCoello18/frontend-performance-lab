const TTL_MS = 30_000;
const SW_MS = 120_000;

interface Entry<T> {
  data: T;
  at: number;
}

const memory = new Map<string, Entry<unknown>>();
const inflight = new Map<string, Promise<unknown>>();

export async function cachedGet<T>(
  url: string,
  loader: () => Promise<T>,
  options?: { skipCache?: boolean },
): Promise<T> {
  const now = Date.now();
  const hit = memory.get(url) as Entry<T> | undefined;
  if (!options?.skipCache && hit && now - hit.at < TTL_MS) {
    return hit.data;
  }
  if (!options?.skipCache && hit && now - hit.at < SW_MS) {
    void run(url, loader);
    return hit.data;
  }
  return run(url, loader);
}

function run<T>(url: string, loader: () => Promise<T>): Promise<T> {
  const pending = inflight.get(url);
  if (pending) return pending as Promise<T>;
  const promise = loader()
    .then((data) => {
      memory.set(url, { data, at: Date.now() });
      return data;
    })
    .finally(() => inflight.delete(url));
  inflight.set(url, promise);
  return promise;
}
