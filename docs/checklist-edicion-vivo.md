# Checklist: edición en vivo (rama `main`)

Andrés edita **en `main`**. No hay `git switch` en el minuto 2. Vite con **`pnpm dev`** (HMR). Segunda pantalla: este archivo + [`hoja-de-ruta.md`](hoja-de-ruta.md).

Plan B al final. Snippets listos para pegar: no reescribas de memoria.

## Antes de grabar

- [ ] `git switch main` y working tree limpio (`git status`).
- [ ] `pnpm dev` → [http://127.0.0.1:5173](http://127.0.0.1:5173) (no `preview` hoy: hace falta HMR).
- [ ] Chrome **154+**. Zoom 125–150 %. Editor 18–20 px.
- [ ] Pestañas abiertas: `index.html` · `src/carousel.ts` · `src/render.ts` · `src/main.ts` · `src/styles/main.css`.
- [ ] Este checklist a la vista. DevTools: **Performance**.
- [ ] Terminal con Plan B escrito, sin Enter: `git checkout -- index.html src/main.ts src/render.ts src/styles/main.css`

## Orden (no improvisar el orden)

1. Browser: clicks en el carrusel + Performance (record → 2 next → stop).
2. Editor: `src/carousel.ts` (el impuesto). Pregunta. Silencio.
3. **Pegar** HTML → `renderCarousel` → `main.ts` → CSS. Guardar cada uno. Vite recarga.
4. Browser: botones/marcadores nativos. CSS `@supports`. Cierre abierto.

Si HMR no pilla el HTML: hard refresh (Ctrl+Shift+R).

---

## 1. `index.html` — sustituye el bloque del carrusel

**Quita** el `<div class="carousel" …>…</div>` (botones, track, dots). **Deja** el `section-head`.

**Pega:**

```html
<ul class="carousel" data-carousel aria-label="Productos destacados"></ul>
<p class="carousel-hint">Desliza. En Chrome 154+ el navegador genera botones y marcadores.</p>
```

---

## 2. `src/render.ts` — pega al final del archivo

El `import type { ProductCard }` ya está. No lo toques. Añade esto debajo de `renderCategories`:

```ts
export function renderCarousel(list: HTMLElement, products: ProductCard[]): void {
  list.innerHTML = products
    .map(
      (product) => `<li class="slide" data-nombre="${product.name}">
      <article>
        <img src="${product.image}" alt="${product.name}" />
        <h3>${product.name}</h3>
        <p>${product.shortDescription}</p>
        <span class="price">${formatPrice(product.price)}</span>
      </article>
    </li>`,
    )
    .join('');
}
```

---

## 3. `src/main.ts` — tres toques

**Import** (línea 1). De:

```ts
import { initCarousel, type ProductCard } from './carousel.ts';
```

a:

```ts
import type { ProductCard } from './carousel.ts';
```

**Import de render** (línea 6). De:

```ts
import { renderCategories, renderProducts, renderReviews } from './render.ts';
```

a:

```ts
import { renderCarousel, renderCategories, renderProducts, renderReviews } from './render.ts';
```

**Llamada** (busca `initCarousel`). De:

```ts
initCarousel(document.querySelector('[data-carousel]')!, again.slice(0, 5));
```

a:

```ts
renderCarousel(document.querySelector('[data-carousel]')!, again.slice(0, 5));
```

`carousel.ts` se queda en el repo. Ya no se ejecuta. Eso es el gag: el widget muerto.

---

## 4. `src/styles/main.css` — sustituye el bloque del widget

**Quita** desde `.carousel {` hasta `.dot.active { … }` inclusive (track, botones, dots). **No toques** `.slide img` ni `.grid`.

**Pega:**

```css
.carousel {
  list-style: none;
  margin: 0;
  position: relative;
  display: flex;
  gap: 1rem;
  overflow-x: auto;
  overscroll-behavior-x: contain;
  scroll-snap-type: x mandatory;
  scroll-behavior: smooth;
  background: var(--card);
  border-radius: 24px;
  padding: 1.2rem 3.4rem 1.4rem;
  box-shadow: var(--shadow);
  scrollbar-width: none;
}

.carousel::-webkit-scrollbar {
  display: none;
}

.slide {
  flex: 0 0 42%;
  scroll-snap-align: start;
  scroll-snap-stop: always;
  min-width: 240px;
}

.carousel-hint {
  color: var(--muted);
  font-size: 0.9rem;
  margin: 0.8rem 0 0;
}

/* Chrome 154+: [before | after] || [links | tabs] */
@supports (scroll-marker-group: after tabs) {
  .carousel {
    scroll-marker-group: after tabs;
    anchor-name: --carrusel;
  }

  .carousel-hint {
    display: none;
  }

  .carousel::scroll-button(*) {
    position: absolute;
    position-anchor: --carrusel;
    align-self: anchor-center;
    width: 44px;
    height: 44px;
    border: 0;
    border-radius: 50%;
    background: var(--ink);
    color: white;
    font-size: 1.4rem;
    cursor: pointer;
  }

  .carousel::scroll-button(*):disabled {
    opacity: 0.25;
    cursor: default;
  }

  .carousel::scroll-button(left) {
    content: '‹' / 'Anterior';
    right: calc(anchor(left) - 52px);
  }

  .carousel::scroll-button(right) {
    content: '›' / 'Siguiente';
    left: calc(anchor(right) - 52px);
  }

  .carousel::scroll-marker-group {
    display: flex;
    justify-content: center;
    gap: 0.45rem;
    margin-top: 0.9rem;
  }

  .slide::scroll-marker {
    content: attr(data-nombre);
    width: 9px;
    height: 9px;
    border-radius: 99px;
    background: #d7cdc0;
    overflow: hidden;
    text-indent: 12px;
    color: transparent;
  }

  .slide::scroll-marker:target-current {
    background: var(--accent);
    width: 22px;
  }
}
```

Guarda. HMR. Vuelve al browser.

---

## Plan B (si se rompe)

No hagas debug en cámara más de 15 s.

```bash
git checkout -- index.html src/main.ts src/render.ts src/styles/main.css
```

Recarga. Si sigue mal:

```bash
git checkout -- .
git switch fix/01-carrusel-css
pnpm dev
```

`fix/01-carrusel-css` es el mismo resultado ya aplicado. No es el plan A.

Tras la clase, para dejar `main` sucio otra vez:

```bash
git switch main
git checkout -- .
```
