# Casa Lumen — laboratorio de rendimiento frontend

Demo de clase para **Andrés Coello**: una landing de tienda que **funciona y se ve bien**, pero está hecha «con IA, sin cuidado». El código de `main` contiene problemas reales de rendimiento, red, carga y seguridad, marcados con `PROBLEMA #N`. La instrumentación de **web-vitals** (LCP, INP, CLS, TTFB) sí está a propósito: es el faro para medir antes y después.

La tesis de la clase (y del post de LinkedIn): **una de las mejores optimizaciones de frontend sigue siendo borrar JavaScript**. El carrusel de productos en `main` replica el lado izquierdo del post (estado, prev/next, puntos, scroll, foco y ARIA a mano). La rama `fix/01-carrusel-css` y `solucion` lo sustituyen por HTML + CSS con `scroll-marker-group` (Chrome 154, modos `links` / `tabs`; ~71 % de soporte global, solo Chromium; Firefox y Safari hacen fallback a scroll-snap).

> Lighthouse hay que lanzarlo contra **`pnpm preview` / `pnpm start`** (build de producción). En `pnpm dev` Vite sirve módulos sueltos, sin minificar y con HMR: las métricas mienten.

Si GitHub Actions no arranca por un bloqueo de facturación de la cuenta, no es un fallo del repo. Los mismos comandos del workflow se pueden correr en local.

## Requisitos

- Node 22 (`.nvmrc`)
- pnpm 10.33.3 (`packageManager` en `package.json`)

```bash
pnpm install
pnpm dev
```

Abre [http://127.0.0.1:5173](http://127.0.0.1:5173). El front (Vite) y la API (Hono en `:3001`) arrancan juntos; Vite proxifica `/api`.

## Comandos

| Comando                                                            | Qué hace                                             |
| ------------------------------------------------------------------ | ---------------------------------------------------- |
| `pnpm dev`                                                         | API + Vite (desarrollo)                              |
| `pnpm build`                                                       | Bundle de producción (Lighthouse se mide sobre esto) |
| `pnpm start`                                                       | Sirve `dist/` + API en `:4173`                       |
| `pnpm preview`                                                     | `build` + `start`                                    |
| `pnpm lint` / `pnpm format:check` / `pnpm typecheck` / `pnpm test` | CI local                                             |

## Estructura

```
index.html              UI de la tienda
src/                    front en TypeScript (sin React)
server/                 API mock (Hono + node:http)
public/images/          JPEG pesados (main) / WebP en las ramas de carga
docs/guion-clase.md     guión Platzi (acciones + ideas, no discurso)
docs/hoja-de-ruta.md    una página: tiempo | pantalla | frases
.github/workflows/ci.yml
```

## Ramas

| Rama                  | Contenido                                                            |
| --------------------- | -------------------------------------------------------------------- |
| `main`                | Versión problemática (punto de partida de la clase)                  |
| `fix/01-carrusel-css` | Carrusel HTML+CSS + fallback scroll-snap                             |
| `fix/02-fetch`        | Promise.all, caché, DTO/paginación, ETag, debounce                   |
| `fix/03-carga`        | Imágenes, fuentes, bundle, lazy/priority, code splitting             |
| `fix/04-seguridad`    | XSS, secretos, cabeceras, CORS, source maps, `.env`                  |
| `solucion`            | Todo lo anterior junto (abre un PR hacia `main` y **no lo mergees**) |

## Problemas (mapa para DevTools)

| #   | Qué                                                                                                                        | Dónde                                                                                                               | Cómo verlo                                                                                                                                                            | Rama que lo corrige         |
| --- | -------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------- |
| 1   | Carrusel JS (estado, botones, puntos, ARIA)                                                                                | `src/carousel.ts`                                                                                                   | Performance: JS de scroll/click. El HTML no usa `scroll-marker-group`.                                                                                                | `fix/01-carrusel-css`       |
| 2   | Cascada de `await`, mismo endpoint N veces, JSON enorme, sin caché, búsqueda sin debounce ni abort                         | `src/main.ts`, `src/search.ts`, `src/fetch-client.ts`, `server/index.ts`                                            | Network: 4+ GET en serie (~380 ms cada uno), `/api/products` repetido, payload con `supplier`/`email`. Teclea rápido en el buscador y mira respuestas fuera de orden. | `fix/02-fetch`              |
| 3   | Imágenes 2 MB sin `width`/`height`, script y fuente bloqueantes, lodash+moment enteros, CSS muerto, sin code splitting     | `index.html`, `src/unused-helpers.ts`, `src/styles/unused.css`, `public/legacy-analytics.js`, `public/images/*.jpg` | Lighthouse (producción): CLS, LCP, render-blocking. Network: JPEG de ~2 MB. Coverage: CSS/JS sin usar.                                                                | `fix/03-carga`              |
| 4   | API key en el bundle, `innerHTML` (XSS), sin CSP, CORS `*`, campos internos, source maps, `console.log`, `.env` commiteado | `src/secrets.ts`, `src/render.ts`, `server/index.ts`, `.env`, `vite.config.ts`                                      | Sources: busca `sk_live_FAKE`. Network: header `Authorization`. Consola: alerta al pintar reseñas. Cabeceras de respuesta sin CSP.                                    | `fix/04-seguridad`          |
| —   | Observabilidad (no es un defecto)                                                                                          | `src/vitals.ts`, `POST /api/metrics`                                                                                | Consola del API: `[vitals]`. Performance: `cascada-inicial`.                                                                                                          | Presente en todas las ramas |

Los comentarios `// PROBLEMA #N` del código apuntan a esta tabla.

## Mediciones (esta máquina de demo)

Cifras **reales** de Lighthouse CLI **12.8.2** + Chrome headless (`--no-sandbox`) contra `pnpm start` en `http://127.0.0.1:4173`, 6 oct 2026. No son una verdad universal: mídalas otra vez en clase. El delay artificial de ~380 ms por request de la API está en ambas ramas a propósito (para que la cascada se vea en Network).

| Métrica                  | `main` (problema)                   | `solucion`                             |
| ------------------------ | ----------------------------------- | -------------------------------------- |
| Performance (Lighthouse) | **69**                              | **94**                                 |
| LCP                      | 12,6 s                              | 2,4 s                                  |
| FCP                      | 3,1 s                               | 2,4 s                                  |
| CLS                      | 0,043                               | 0,050                                  |
| TBT                      | 10 ms                               | 0 ms                                   |
| Peticiones               | 24                                  | 20                                     |
| Transferido              | 17 817 KiB (~17,8 MB)               | 126 KiB                                |
| JS Vite (sin comprimir)  | 212,88 kB + source map 1,30 MB      | 14,87 kB en 3 chunks, sin map          |
| JS Vite gzip             | 71,86 kB                            | 6,06 kB                                |
| `GET /api/products`      | 35 056 B, 25 campos, con `supplier` | 1 311 B, 6 campos públicos, paginado   |
| Hero                     | JPEG 1 960 940 B                    | WebP 2 948 B                           |
| Imágenes en Lighthouse   | 10 peticiones / ~17,8 MB            | 6 peticiones / ~23 KB (`loading=lazy`) |

Cómo repetirlo:

```bash
pnpm preview
npx lighthouse http://127.0.0.1:4173 --only-categories=performance --chrome-flags="--headless --no-sandbox"
```

Guión de clase (un tema: borrar el JS del carrusel): [`docs/guion-clase.md`](docs/guion-clase.md) · hoja imprimible: [`docs/hoja-de-ruta.md`](docs/hoja-de-ruta.md).
