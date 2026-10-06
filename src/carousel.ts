import { formatPrice } from './format.ts';

export interface ProductCard {
  id: string;
  name: string;
  shortDescription: string;
  price: number;
  image: string;
  description?: string;
  reviews?: Array<{ author: string; body: string; rating: number }>;
}

function slideTemplate(product: ProductCard, index: number, total: number): string {
  return `
    <article class="slide" role="group" aria-roledescription="lámina" aria-label="${index + 1} de ${total}" data-index="${index}">
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>${product.shortDescription}</p>
      <span class="price">${formatPrice(product.price)}</span>
    </article>
  `;
}

/**
 * PROBLEMA #1: carrusel en TypeScript a mano (estado, prev/next, puntos,
 * sincronizar scroll, foco y ARIA). Equivalente al lado izquierdo del post.
 */
export function initCarousel(root: HTMLElement, products: ProductCard[]): void {
  const track = root.querySelector<HTMLElement>('[data-track]');
  const dots = root.querySelector<HTMLElement>('[data-dots]');
  const prev = root.querySelector<HTMLButtonElement>('[data-prev]');
  const next = root.querySelector<HTMLButtonElement>('[data-next]');
  if (!track || !dots || !prev || !next) return;

  let activeIndex = 0;

  track.innerHTML = products.map((p, i) => slideTemplate(p, i, products.length)).join('');
  dots.innerHTML = products
    .map(
      (_, i) =>
        `<button type="button" class="dot" role="tab" aria-selected="${i === 0}" aria-label="Ir a ${i + 1}" data-dot="${i}"></button>`,
    )
    .join('');

  const slides = [...track.querySelectorAll<HTMLElement>('.slide')];

  const setActive = (index: number, focusSlide = false) => {
    activeIndex = (index + products.length) % products.length;
    const slide = slides[activeIndex];
    if (!slide) return;
    track.scrollTo({ left: slide.offsetLeft, behavior: 'smooth' });
    dots.querySelectorAll<HTMLButtonElement>('.dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === activeIndex);
      dot.setAttribute('aria-selected', String(i === activeIndex));
      dot.tabIndex = i === activeIndex ? 0 : -1;
    });
    slides.forEach((s, i) => {
      s.setAttribute('aria-hidden', String(i !== activeIndex));
      s.tabIndex = i === activeIndex ? 0 : -1;
    });
    if (focusSlide) slide.focus();
  };

  prev.addEventListener('click', () => setActive(activeIndex - 1));
  next.addEventListener('click', () => setActive(activeIndex + 1));
  dots.addEventListener('click', (event) => {
    const btn = (event.target as HTMLElement).closest<HTMLButtonElement>('[data-dot]');
    if (!btn) return;
    setActive(Number(btn.dataset.dot));
  });

  track.addEventListener('scroll', () => {
    const width = slides[0]?.clientWidth ?? track.clientWidth;
    const nextIndex = Math.round(track.scrollLeft / Math.max(width, 1));
    if (nextIndex !== activeIndex && nextIndex >= 0 && nextIndex < products.length) {
      activeIndex = nextIndex;
      setActive(activeIndex);
    }
  });

  root.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') setActive(activeIndex - 1, true);
    if (event.key === 'ArrowRight') setActive(activeIndex + 1, true);
  });

  setActive(0);
}
