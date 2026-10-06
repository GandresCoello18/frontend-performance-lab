import { PAYMENTS_API_KEY } from './secrets.ts';

export async function getJson<T>(url: string): Promise<T> {
  // PROBLEMA #2: sin caché, sin deduplicar, sin timeout, sin AbortController.
  const response = await fetch(url, {
    headers: {
      // PROBLEMA #4: la clave viaja en cada petición y aparece en la pestaña Network.
      Authorization: `Bearer ${PAYMENTS_API_KEY}`,
    },
  });
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} ${url}`);
  }
  const data = (await response.json()) as T;
  // PROBLEMA #4: volcado verboso de datos (incluye emails, costes, proveedores).
  console.log('[fetch]', url, data);
  return data;
}
