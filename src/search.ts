import { getJson } from './fetch-client.ts';
import { renderSearchResults } from './render.ts';
import type { ProductCard } from './carousel.ts';

/**
 * PROBLEMA #2: cada tecla dispara un GET. No hay debounce ni AbortController,
 * así que una respuesta lenta puede pitar encima de una más reciente.
 */
export function initSearch(input: HTMLInputElement, results: HTMLElement): void {
  input.addEventListener('input', async () => {
    const q = input.value.trim();
    results.hidden = false;
    const data = await getJson<ProductCard[]>(`/api/products?q=${encodeURIComponent(q)}`);
    renderSearchResults(results, data);
  });
}
