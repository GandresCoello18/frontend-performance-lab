# Hoja de ruta — 4,5 min (segunda pantalla)

Tema: **borrar el JS del carrusel**. Rama inicial: `main`. URL: `http://127.0.0.1:4173`. Chrome 154+.

|   Tiempo | Pantalla (haz esto)                                                     | Ideas, no las leas                                                               |
| -------: | ----------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| **0:00** | Tienda ya cargada. Click next 2 veces.                                  | Carrusel de IA. Funciona. El coste no se ve. Vas a poder _borrar_ el widget.     |
| **0:15** | F12 → **Performance** → Record → clicks → Stop. Main thread.            | Camarero vs cinta del sushi. Pagamos el hilo principal.                          |
| **0:40** | Editor: `src/carousel.ts`. Scroll: estado, dots, ARIA, `scrollTo`.      | No está mal. Sobramos.                                                           |
| **1:20** | Network → JS. ~**213 kB** en `main`.                                    | Un número. No audites el resto.                                                  |
| **1:50** | Cámara. Archivo a pantalla. **Calla.**                                  | «¿Cuál de estas líneas _tiene_ que ser JS?» Espera.                              |
| **2:10** | Terminal: `git switch fix/01-carrusel-css` → recarga.                   | Mismos productos. El HTML ya no trae botones.                                    |
| **2:30** | Click botones/marcadores nativos.                                       | El navegador los genera.                                                         |
| **2:50** | `src/styles/main.css` → `scroll-marker-group: after tabs`. `@supports`. | `tabs` = tablist (Chrome 154). Firefox/Safari: solo snap.                        |
| **3:40** | Network/Coverage: el widget ya no es nuestro JS.                        | Mejor JS = el que no envías.                                                     |
| **4:20** | CSS `@supports`. Corta en pregunta.                                     | ¿Shippeamos con fallback? ¿Cuándo sí hace falta JS? Próxima: fetches en cascada. |
|  _+30 s_ | Lighthouse solo si sobra: **69 → 94**. Dato de hoy: **213 kB** de JS.   | Medir en `pnpm preview`, nunca en `dev`.                                         |

**No tocar hoy:** Network de `/api`, reseñas XSS, `.env`, Lighthouse entero, rama `solucion` salvo el buffer.
