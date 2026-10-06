import { debounce, getJson } from './fetch-client.ts';
import { renderSearchResults } from './render.ts';
import type { ProductCard } from './carousel.ts';

interface ProductPage {
  items: ProductCard[];
}

export function initSearch(input: HTMLInputElement, results: HTMLElement): void {
  let abort: AbortController | undefined;

  const run = async (q: string) => {
    abort?.abort();
    abort = new AbortController();
    results.hidden = false;
    results.innerHTML = '<p class="muted">Buscando…</p>';
    try {
      const path = `/api/products?q=${encodeURIComponent(q)}&page=1&limit=8`;
      const data = await getJson<ProductPage>(path, { signal: abort.signal, skipCache: true });
      renderSearchResults(results, data.items);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      results.innerHTML = '<p class="muted">No pudimos buscar. Prueba otra vez.</p>';
    }
  };

  const delayed = debounce((value) => {
    void run(value);
  }, 280);

  input.addEventListener('input', () => delayed(input.value.trim()));
}
