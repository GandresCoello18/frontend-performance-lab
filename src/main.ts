import { getJson } from './fetch-client.ts';
import { headline, todayLabel } from './format.ts';
import { renderCarousel, renderCategories, renderProducts, renderReviews } from './render.ts';
import type { ProductCard } from './types.ts';

interface ProductPage {
  items: ProductCard[];
  total: number;
}

interface ReviewDto {
  author: string;
  body: string;
  rating: number;
}

interface CategoryDto {
  name: string;
}

async function boot(): Promise<void> {
  void import('./vitals.ts').then((m) => m.initVitals());
  document.querySelector('[data-fecha]')!.textContent = `${headline('catálogo')} · ${todayLabel()}`;

  const status = document.querySelector<HTMLElement>('[data-status]')!;
  const searchInput = document.querySelector<HTMLInputElement>('[data-search]')!;
  const searchResults = document.querySelector<HTMLElement>('[data-search-results]')!;
  void import('./search.ts').then((m) => m.initSearch(searchInput, searchResults));

  status.hidden = false;
  status.textContent = 'Cargando catálogo…';

  performance.mark('carga-inicio');
  try {
    const [featured, page, reviews, categories] = await Promise.all([
      getJson<ProductCard[]>('/api/featured'),
      getJson<ProductPage>(
        '/api/products?page=1&limit=12&fields=id,name,shortDescription,price,image',
      ),
      getJson<ReviewDto[]>('/api/reviews'),
      getJson<CategoryDto[]>('/api/categories'),
    ]);

    const highlight = featured[0];
    if (highlight) {
      document.querySelector('[data-hero-kicker]')!.textContent = highlight.name;
      document.querySelector('[data-hero-text]')!.textContent = highlight.shortDescription;
    }

    renderProducts(document.querySelector('[data-grid]')!, page.items);
    renderCarousel(document.querySelector('[data-carousel]')!, featured);
    renderReviews(document.querySelector('[data-reviews]')!, reviews);
    renderCategories(document.querySelector('[data-cats]')!, categories);
    status.hidden = true;
  } catch (error) {
    console.error(error);
    status.hidden = false;
    status.textContent = 'No pudimos cargar el catálogo. Revisa la red y recarga.';
  } finally {
    performance.mark('carga-fin');
    performance.measure('cascada-inicial', 'carga-inicio', 'carga-fin');
    const measure = performance.getEntriesByName('cascada-inicial')[0];
    if (measure) {
      console.info('[perf] carga-inicial', Math.round(measure.duration), 'ms');
    }
  }
}

void boot();
