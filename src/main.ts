import { initCarousel, type ProductCard } from './carousel.ts';
import { getJson } from './fetch-client.ts';
import { headline, todayLabel } from './format.ts';
import { renderCategories, renderProducts, renderReviews } from './render.ts';

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

  const searchInput = document.querySelector<HTMLInputElement>('[data-search]')!;
  const searchResults = document.querySelector<HTMLElement>('[data-search-results]')!;
  void import('./search.ts').then((m) => m.initSearch(searchInput, searchResults));

  // PROBLEMA #2: cascada — cuatro awaits en serie que podrían ir en Promise.all.
  performance.mark('carga-inicio');

  const featured = await getJson<ProductCard[]>('/api/featured');
  const highlight = featured[0];
  if (highlight) {
    document.querySelector('[data-hero-kicker]')!.textContent = highlight.name;
    document.querySelector('[data-hero-text]')!.textContent = highlight.shortDescription;
  }

  const products = await getJson<ProductCard[]>('/api/products');
  renderProducts(document.querySelector('[data-grid]')!, products);

  const reviews = await getJson<ReviewDto[]>('/api/reviews');
  renderReviews(document.querySelector('[data-reviews]')!, reviews);

  const categories = await getJson<CategoryDto[]>('/api/categories');
  renderCategories(document.querySelector('[data-cats]')!, categories);

  performance.mark('carga-fin');
  performance.measure('cascada-inicial', 'carga-inicio', 'carga-fin');
  const measure = performance.getEntriesByName('cascada-inicial')[0];
  console.log('[perf] cascada-inicial', measure?.duration);

  // PROBLEMA #2: el carrusel vuelve a pedir el mismo endpoint.
  performance.mark('carrusel-inicio');
  const again = await getJson<ProductCard[]>('/api/products');
  initCarousel(document.querySelector('[data-carousel]')!, again.slice(0, 5));
  performance.mark('carrusel-fin');
  performance.measure('fetch-carrusel', 'carrusel-inicio', 'carrusel-fin');
}

void boot();
