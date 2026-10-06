# Checklist: edición en vivo — fetch (rama `main`)

Andrés edita **en `main`**. Un pegado. Vite: **`pnpm dev`**. El carrusel JS **no se toca**. Segunda pantalla: este archivo + [`hoja-de-ruta.md`](hoja-de-ruta.md).

El API de `main` devuelve **arrays** (`Product[]`), no `{ items, page }`. No pegues las URLs con `?page=` de `fix/02-fetch` o se rompe el render.

## Antes de grabar

- [ ] `git switch main` y `git status` limpio.
- [ ] `pnpm dev` → [http://127.0.0.1:5173](http://127.0.0.1:5173) (HMR; no `preview` hoy).
- [ ] Zoom 125–150 %. Editor 18–20 px.
- [ ] DevTools: **Network** (Disable cache ON, Fetch/XHR). Consola a la vista para `[perf] cascada-inicial`.
- [ ] Pestaña abierta: `src/main.ts` (líneas del `PROBLEMA #2`).
- [ ] Plan B, sin Enter: `git checkout -- src/main.ts`

## Orden

1. Network: Reload. Señala la escalera y `/api/products` **dos veces**.
2. Editor: el bloque de `await` + el segundo GET.
3. Pregunta. Silencio.
4. **Un pegado** (abajo). Guarda. HMR.
5. Network otra vez + consola (`cascada-inicial` ms).
6. Carrusel: sigue ahí, en JS. Teaser. Cierre.

---

## El pegado (único) — `src/main.ts`

**Selecciona** desde el comentario `// PROBLEMA #2: cascada` hasta `performance.measure('fetch-carrusel', …);` inclusive (los dos bloques #2: cuatro `await` + el segundo GET).

**Pega esto.** Sigue habiendo `initCarousel`. Cambia _de dónde salen_ los datos, no el widget.

```ts
// Una ronda en paralelo. El carrusel reutiliza `featured` (nada de segundo GET).
performance.mark('carga-inicio');

const [featured, products, reviews, categories] = await Promise.all([
  getJson<ProductCard[]>('/api/featured'),
  getJson<ProductCard[]>('/api/products'),
  getJson<ReviewDto[]>('/api/reviews'),
  getJson<CategoryDto[]>('/api/categories'),
]);

const highlight = featured[0];
if (highlight) {
  document.querySelector('[data-hero-kicker]')!.textContent = highlight.name;
  document.querySelector('[data-hero-text]')!.textContent = highlight.shortDescription;
}

renderProducts(document.querySelector('[data-grid]')!, products);
renderReviews(document.querySelector('[data-reviews]')!, reviews);
renderCategories(document.querySelector('[data-cats]')!, categories);

performance.mark('carga-fin');
performance.measure('cascada-inicial', 'carga-inicio', 'carga-fin');
const measure = performance.getEntriesByName('cascada-inicial')[0];
console.log('[perf] cascada-inicial', measure?.duration);

initCarousel(document.querySelector('[data-carousel]')!, featured);
```

Guarda. En Network: **cuatro barras a la vez**, un solo `/api/products`. En consola: `cascada-inicial` ~380 ms (antes ~1,9 s: 5 × ~380 ms).

---

## En casa / Plan B (no grabar si el tiempo aprieta)

Caché/dedupe, `fields`, debounce: rama `fix/02-fetch` (`src/cache.ts`, `fetch-client.ts`, API). Hoy no se pegan: son más archivos y el API de `main` no pagina.

**Si se rompe (15 s máx.):**

```bash
git checkout -- src/main.ts
```

Último recurso:

```bash
git checkout -- .
git switch fix/02-fetch
pnpm dev
```

Ahí el carrusel **sigue en JS** (`initCarousel`). No es `fix/01`.

Tras la clase, dejar `main` sucio otra vez:

```bash
git switch main
git checkout -- .
```
