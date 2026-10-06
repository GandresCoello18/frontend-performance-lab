import { debounce, getJson } from './fetch-client.ts';
import { renderSearchResults } from './render.ts';
import type { ProductCard } from './types.ts';

interface ProductPage {
  items: ProductCard[];
}

export function initSearch(input: HTMLInputElement, results: HTMLElement): void {
  let abort: AbortController | undefined;

  const run = async (q: string) => {
    abort?.abort();
    abort = new AbortController();
    results.hidden = false;
    results.replaceChildren();
    const loading = document.createElement('p');
    loading.className = 'muted';
    loading.textContent = 'Buscando…';
    results.append(loading);
    try {
      const path = `/api/products?q=${encodeURIComponent(q)}&page=1&limit=8`;
      const data = await getJson<ProductPage>(path, { signal: abort.signal, skipCache: true });
      renderSearchResults(results, data.items);
    } catch (error) {
      if ((error as Error).name === 'AbortError') return;
      results.replaceChildren();
      const fail = document.createElement('p');
      fail.className = 'muted';
      fail.textContent = 'No pudimos buscar. Prueba otra vez.';
      results.append(fail);
    }
  };

  const delayed = debounce((value) => {
    void run(value);
  }, 280);

  input.addEventListener('input', () => delayed(input.value.trim()));
}
