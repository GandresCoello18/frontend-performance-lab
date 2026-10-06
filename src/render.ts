import { formatPrice } from './format.ts';
import type { ProductCard } from './carousel.ts';

function el<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  attrs: Record<string, string> = {},
): HTMLElementTagNameMap[K] {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  }
  return node;
}

export function renderProducts(grid: HTMLElement, products: ProductCard[]): void {
  grid.replaceChildren(
    ...products.map((product) => {
      const article = el('article', { class: 'card', 'data-id': product.id });
      const img = el('img', { src: product.image, alt: product.name });
      const title = el('h3');
      title.textContent = product.name;
      const copy = el('p');
      copy.textContent = product.shortDescription;
      const price = el('span', { class: 'price' });
      price.textContent = formatPrice(product.price);
      article.append(img, title, copy, price);
      return article;
    }),
  );
}

export function renderReviews(list: HTMLElement, reviews: ProductCard['reviews']): void {
  list.replaceChildren();
  if (!reviews) return;
  for (const review of reviews) {
    const quote = el('blockquote', { class: 'review' });
    const who = el('strong');
    who.textContent = review.author;
    const stars = el('span', { class: 'stars' });
    stars.textContent = '★'.repeat(review.rating);
    const body = el('p');
    body.textContent = review.body;
    quote.append(who, stars, body);
    list.append(quote);
  }
}

export function renderSearchResults(box: HTMLElement, products: ProductCard[]): void {
  box.replaceChildren();
  if (products.length === 0) {
    const empty = el('p', { class: 'muted' });
    empty.textContent = 'Sin resultados.';
    box.append(empty);
    return;
  }
  for (const product of products) {
    const item = el('li');
    const link = el('a', { href: '#catalogo' });
    link.textContent = `${product.name} · ${formatPrice(product.price)}`;
    item.append(link);
    box.append(item);
  }
}

export function renderCategories(elRoot: HTMLElement, categories: Array<{ name: string }>): void {
  elRoot.replaceChildren(
    ...categories.map((category) => {
      const item = el('li');
      item.textContent = category.name;
      return item;
    }),
  );
}
