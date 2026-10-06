import { initCarousel, type ProductCard } from './carousel.ts';
import { fakeSessionId } from './dead-code.ts';
import { getJson } from './fetch-client.ts';
import { headline, todayLabel } from './unused-helpers.ts';
import { initSearch } from './search.ts';
import { renderCategories, renderProducts, renderReviews } from './render.ts';
import { initVitals } from './vitals.ts';

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
  initVitals();
  document.querySelector('[data-fecha]')!.textContent = `${headline('catálogo')} · ${todayLabel()}`;
  console.log('[sesion]', fakeSessionId());

  const status = document.querySelector<HTMLElement>('[data-status]')!;
  const searchInput = document.querySelector<HTMLInputElement>('[data-search]')!;
  const searchResults = document.querySelector<HTMLElement>('[data-search-results]')!;
  initSearch(searchInput, searchResults);

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
    initCarousel(document.querySelector('[data-carousel]')!, featured);
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
    console.log('[perf] cascada-inicial', measure?.duration);
  }
}

void boot();
