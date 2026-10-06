# Guión de clase (~5 minutos)

Objetivo: que se vea, en vivo, que **borrar JavaScript** (y dejar de pedir de más) mueve más la aguja que micro-optimizar un `for`. La landing de Casa Lumen ya está pintada en `main`; no hay que construirla.

Antes de arrancar: `pnpm preview` en `main` (Lighthouse se mide sobre producción, no sobre Vite). Ten DevTools abierto en Network + Performance. Opcional: Lighthouse en el panel.

## Minuto a minuto

### 0:00–0:30 — El gancho

«Esta tienda funciona y se ve bien. La ha podido escribir una IA. El problema no es que falle: es lo que no se ve hasta que abres DevTools.»

Muestra el post: izquierda, carrusel React/JS con estado; derecha, el mismo patrón con `scroll-marker-group`. Tesis: **el navegador ya sabe hacer un carrusel**.

### 0:30–1:30 — Borrar el carrusel (PROBLEMA #1)

En `src/carousel.ts`: `activeIndex`, `prev`/`next`, puntos, `scrollTo`, foco, `aria-selected`.

En Chrome 154 el CSS equivalente es:

```css
.carousel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-marker-group: after tabs; /* modo tablist; `links` es el default */
}
.carousel::scroll-button(left) {
  content: '‹' / 'Anterior';
}
.carousel::scroll-button(right) {
  content: '›' / 'Siguiente';
}
.slide::scroll-marker {
  content: '';
}
.slide::scroll-marker:target-current {
  background: var(--accent);
}
```

`tabs` vs `links` (Chrome 154): `tabs` alinea el foco con WAI-ARIA tablist; `links` deja cada marcador como enlace. Soporte global ~71 %, **solo Chromium**. Por eso `@supports (scroll-marker-group: after tabs)` y, si no, scroll-snap a secas (Firefox/Safari: se desliza, no hay puntos mágicos).

Cambio de rama: `git switch fix/01-carrusel-css`. «El JS que queda es pintar datos, no el widget.»

### 1:30–2:45 — Fetch: cascada, duplicados, sobre-fetch, búsqueda (PROBLEMA #2)

Network en `main`:

1. `/api/featured` → espera
2. `/api/products` → espera
3. `/api/reviews` → espera
4. `/api/categories` → espera
5. `/api/products` **otra vez** (el carrusel)

Cada una ~380 ms de delay de demo. Cuatro awaits en serie ≈ 1,5 s de red inventada; `Promise.all` lo deja en una ronda.

Abre un JSON: `supplier.email`, `unitCost`, `internalNotes`, reseñas completas. La tarjeta usa nombre, precio, foto.

Teclea «lám» en el buscador: un GET por tecla, sin `AbortController`. Una respuesta lenta pisa a una rápida.

Rama: `fix/02-fetch` (Promise.all, caché/dedupe, `fields`+página, ETag, debounce + abort, estados de carga).

### 2:45–3:30 — Caché de verdad

En `main` las respuestas no traen `Cache-Control` ni `ETag`. Recarga: mismo peso.

En la solución: `ETag` + `304`, `Cache-Control`, gzip, y un Map en memoria con TTL / stale-while-revalidate. «Caché no es solo Service Worker.»

### 3:30–4:15 — Un solo ejemplo de seguridad (PROBLEMA #4)

Elige **uno** (el resto queda para preguntas):

- Sources → busca `sk_live_FAKE`: la clave va en el bundle y en `Authorization`.
- Reseñas: `innerHTML` ejecuta `<img onerror=alert(...)>` (payload de demo, inofensivo).
- Cabeceras: no hay CSP ni `X-Content-Type-Options`. CORS `*`.

Rama: `fix/04-seguridad`.

### 4:15–5:00 — Medir antes / después

Consola de la API: líneas `[vitals]` con LCP/INP/CLS/TTFB. Performance: medida `cascada-inicial`.

Lighthouse **solo** sobre `pnpm preview`. Compara `main` vs `solucion` (cifras de esta máquina en el README). Cierra: «el mejor JS es el que no envías; el que queda, que pida poco y se pueda observar.»

## Extra para preguntas (si sobra tiempo)

- Imágenes: JPEG ~2 MB sin `width`/`height` (CLS) vs WebP + `fetchpriority="high"` en el LCP y `loading="lazy"` en el resto.
- `lodash` + `moment` enteros vs `Intl` nativo.
- CSS muerto (`unused.css`) y Coverage.
- Source maps en producción.
- `.env` subido a git (valores FAKE).
- Por qué `pnpm dev` no vale para Lighthouse.
- `scroll-marker-group: after tabs` vs `after links`.
- DTO: el storefront no necesita el email del proveedor.

## Cómo repetir las mediciones

```bash
pnpm preview          # en main, luego en solucion
npx lighthouse http://127.0.0.1:4173 --only-categories=performance --chrome-flags="--headless --no-sandbox" --output=json --output-path=lh.json
```
