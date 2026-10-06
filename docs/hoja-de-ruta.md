# Hoja de ruta — 4,5 min (segunda pantalla)

Tema: **fetch** (cascada + GET duplicado). Rama: **`main`**. URL: `:5173` (`pnpm dev`). Carrusel JS **no se toca**. Pega: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).

|   Tiempo | Pantalla (haz esto)                                                              | Ideas, no las leas                                         |
| -------: | -------------------------------------------------------------------------------- | ---------------------------------------------------------- |
| **0:00** | Network abierto. Reload. Escalera de barras.                                     | Tarda. No es el CSS. Cinco viajes en fila.                 |
| **0:25** | Hover: `/api/products` **dos veces**.                                            | El carrusel pidió el catálogo otra vez.                    |
| **0:45** | `src/main.ts`: cuatro `await` + `again = getJson('/api/products')`.              | B no dependía de A. Teatro de `await`.                     |
| **1:50** | Cámara. **Calla.**                                                               | «¿Cuántas veces pedimos lo mismo?» Espera.                 |
| **2:10** | Un pegado: `Promise.all` + `initCarousel(..., featured)`.                        | Paralelo y sin repetir. El widget sigue.                   |
| **3:20** | Reload. Cuatro barras juntas. Consola: `cascada-inicial` ~380 ms (antes ~1,9 s). | Un número. No Lighthouse.                                  |
| **4:15** | Click al carrusel (sigue en JS). Corta.                                          | Medir → paralelo → no repetir. Próxima: CSS nativo.        |
|  _+30 s_ | Caché = casa (`fix/02-fetch`).                                                   | Plan B: `git checkout -- src/main.ts`. Nunca `fix/01` hoy. |

**No tocar hoy:** `carousel.ts`, HTML del carrusel, XSS, `.env`, `git switch` en el plan A.
