import { formatPrice } from './format.ts';
import type { ProductCard } from './carousel.ts';

function cardHtml(product: ProductCard): string {
  return `<article class="card" data-id="${product.id}">
    <img src="${product.image}" alt="${product.name}" />
    <h3>${product.name}</h3>
    <p>${product.shortDescription}</p>
    <span class="price">${formatPrice(product.price)}</span>
  </article>`;
}

export function renderProducts(grid: HTMLElement, products: ProductCard[]): void {
  // PROBLEMA #4: innerHTML con datos del API (la reseña maliciosa se pinta más abajo).
  grid.innerHTML = products.map(cardHtml).join('');
}

export function renderReviews(list: HTMLElement, reviews: ProductCard['reviews']): void {
  if (!reviews) {
    list.innerHTML = '';
    return;
  }
  // PROBLEMA #4: XSS — el cuerpo de la reseña se inserta con innerHTML.
  list.innerHTML = reviews
    .map(
      (review) => `<blockquote class="review">
        <strong>${review.author}</strong>
        <span class="stars">${'★'.repeat(review.rating)}</span>
        <p>${review.body}</p>
      </blockquote>`,
    )
    .join('');
}

export function renderSearchResults(box: HTMLElement, products: ProductCard[]): void {
  box.innerHTML =
    products.length === 0
      ? '<p class="muted">Sin resultados.</p>'
      : products
          .map((p) => `<li><a href="#catalogo">${p.name} · ${formatPrice(p.price)}</a></li>`)
          .join('');
}

export function renderCategories(el: HTMLElement, categories: Array<{ name: string }>): void {
  el.innerHTML = categories.map((c) => `<li>${c.name}</li>`).join('');
}
