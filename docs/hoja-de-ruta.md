# Hoja de ruta — 4,5 min (segunda pantalla)

Tema: **borrar el JS del carrusel**. Rama: **`main`**. URL: `http://127.0.0.1:5173` (`pnpm dev`). Chrome 154+. Pega desde [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).

|   Tiempo | Pantalla (haz esto)                                                              | Ideas, no las leas                                             |
| -------: | -------------------------------------------------------------------------------- | -------------------------------------------------------------- |
| **0:00** | Tienda. Click next 2 veces.                                                      | Funciona. El coste no se ve. Vas a _borrar_ el widget en vivo. |
| **0:15** | F12 → **Performance** → Record → clicks → Stop.                                  | Camarero vs cinta del sushi. Pagamos el hilo principal.        |
| **0:40** | `src/carousel.ts`: estado, dots, ARIA, `scrollTo`.                               | No está mal. Sobramos.                                         |
| **1:50** | Cámara. **Calla.**                                                               | «¿Cuál de estas líneas _tiene_ que ser JS?» Espera.            |
| **2:05** | Pega HTML: `<ul class="carousel">` + hint.                                       | Se van los botones del markup.                                 |
| **2:20** | Pega `renderCarousel` al final de `render.ts`.                                   | Solo pinta `<li>`.                                             |
| **2:35** | `main.ts`: `import type` + `renderCarousel(…)`.                                  | `carousel.ts` deja de ejecutarse.                              |
| **2:50** | Pega CSS `@supports` (sustituye `.carousel` … `.dot`).                           | `scroll-marker-group: after tabs`.                             |
| **3:50** | Recarga si hace falta. Click marcadores nativos.                                 | El navegador genera botones y puntos.                          |
| **4:20** | `@supports`. Corta en pregunta.                                                  | ¿Shippeamos el fallback? ¿Cuándo sí JS? Próxima: fetches.      |
|  _+30 s_ | Dato: JS **213 kB** en `main`. Lighthouse solo si sobra (69 → 94, en `preview`). | HMR es `dev`. Medir producción es `preview`.                   |

**Plan B:** `git checkout -- index.html src/main.ts src/render.ts src/styles/main.css`. Último recurso: `git switch fix/01-carrusel-css`.

**No tocar hoy:** Network `/api`, XSS, `.env`, `git switch` en el plan A.
