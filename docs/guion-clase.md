# Guión de clase Platzi (~4–4,5 min)

Tema **único**: borrar el JavaScript de un carrusel de productos (`scroll-marker-group` vs el widget a mano). Nada de fetch, seguridad ni Lighthouse completo en vivo.

Se edita **en `main`**, con `pnpm dev` y HMR. No hay cambio de rama. Snippets: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).

No es un discurso. Es un mapa de **acciones** + frases sueltas. No lo leas.

## En los primeros 10 segundos

Pantalla ya abierta: tienda en `http://127.0.0.1:5173`, carrusel a la vista. Cámara + pantalla.

**Frase 1 (el caso, no el hola):**
«Este carrusel funciona. Lo podría haber escrito una IA. El problema no es que falle: es que le estamos pagando al hilo principal por un trabajo que el navegador ya sabe hacer.»

**Qué va a poder hacer el estudiante (ya):**
«Al terminar vas a poder mirar un carrusel, contar cuánto JS es el widget, y sustituirlo por CSS nativo pegando cuatro bloques.»

**Idea central (antes del segundo 10):**
Borrar JavaScript sigue siendo una de las mejores optimizaciones de frontend.

---

## Checklist (5 min antes de grabar)

- [ ] Rama: `main`, limpia. Comando: **`pnpm dev`** → `:5173`. (Hoy no es `preview`: hace falta HMR.)
- [ ] Chrome **154+** (`scroll-marker-group` modos `tabs` / `links` ~154). Zoom **125–150 %**. Editor **18–20 px**.
- [ ] DevTools: **Performance**. Segunda pantalla: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md) y [`hoja-de-ruta.md`](hoja-de-ruta.md).
- [ ] Pestañas: `index.html`, `src/carousel.ts`, `src/render.ts`, `src/main.ts`, `src/styles/main.css`.
- [ ] Plan B en la terminal, sin Enter: `git checkout -- index.html src/main.ts src/render.ts src/styles/main.css`
- [ ] No leas esto. Pega. No reescribas de memoria.

---

## Analogía (una sola, toda la clase)

El navegador es la cinta del sushi: ya mueve los platos. Nosotros contratamos a un camarero (`activeIndex`, `scrollTo`, ARIA, puntos) para llevar cada plato a mano. El camarero cobra en **hilo principal**.

Dila de dos formas:

1. «Le estamos pagando a un camarero por un trabajo que la cinta ya hace.»
2. «El mejor JS del carrusel es el que no enviamos.»

---

## Pregunta al estudiante (antes de pegar el CSS)

Tras enseñar `carousel.ts`, **párate**:

«Si el navegador ya hace scroll, ya hace botones y ya sabe cuál lámina está a la vista… ¿cuál de estas líneas _tiene_ que ser JavaScript?»

Cuenta hasta tres. Luego: «ninguna de las del widget. El JS que queda es pintar datos. Ahora lo vamos a borrar en vivo.»

---

## Minuto a minuto — acciones (no texto para leer)

### 0:00–0:40 — El carrusel “va bien”

| Haz                                          | Dónde                       |
| -------------------------------------------- | --------------------------- |
| Click prev / next, puntos                    | Browser `:5173`, Destacados |
| «Se ve bien. Eso no basta.»                  | —                           |
| F12 → Performance → Record → 2–3 next → Stop | DevTools Performance        |
| Señala scripting / click en el main thread   | Performance                 |

**Ideas, no las leas**

- Funciona. El bug es el coste, no el crash.
- Cada click es trabajo nuestro en el hilo que también pinta.
- [Hueco anécdota] «La última landing que revisé, generada con IA, tenía exactamente este archivo: estado, ARIA y `scrollTo` para tres fotos.»

### 0:40–1:50 — El impuesto del widget

| Haz                                                                  | Dónde             |
| -------------------------------------------------------------------- | ----------------- |
| Alt-tab al editor                                                    | `src/carousel.ts` |
| Scroll: `activeIndex`, `setActive`, dots, `keydown`, `aria-selected` | Mismo archivo     |
| No te metas en fetch ni en las imágenes                              | —                 |

**Ideas, no las leas**

- Estado, eventos, scroll, foco, ARIA: el lado izquierdo del post.
- No está mal escrito. **No debería existir.**
- Un checkbox no lo programamos en JS. El carrusel, cada vez menos.

### 1:50–2:05 — Pregunta (silencio)

| Haz                            | Dónde  |
| ------------------------------ | ------ |
| `carousel.ts` a pantalla       | Editor |
| Pregunta. Espera. No rellenes. | Cámara |

### 2:05–3:50 — Edición en vivo (pega, no tipear)

Orden fijo. Snippets en el checklist. Tras cada save, un vistazo al browser si Vite parpadea.

| Haz                                                                                                                                     | Archivo               |
| --------------------------------------------------------------------------------------------------------------------------------------- | --------------------- |
| Sustituye el `<div class="carousel">` (botones/track/dots) por el `<ul>` + hint                                                         | `index.html`          |
| Pega `renderCarousel` al final                                                                                                          | `src/render.ts`       |
| Quita `initCarousel` del import; deja `import type { ProductCard }`. Añade `renderCarousel` al import de `render.ts`. Cambia la llamada | `src/main.ts`         |
| Sustituye el bloque `.carousel` … `.dot.active` por el CSS con `@supports`                                                              | `src/styles/main.css` |
| Si el HTML no recargó: Ctrl+Shift+R                                                                                                     | Browser               |

**Ideas, no las leas** (mientras pegas, poco habla)

- El HTML ya no trae botones. El navegador los va a generar.
- `renderCarousel` solo pinta `<li>`. Cero `activeIndex`.
- `carousel.ts` se queda en el disco. Ya no corre. Eso es borrar JS.

Si algo explota: Plan B (`git checkout --` esos cuatro archivos). 15 s máximo. Rama `fix/01-carrusel-css` solo si el checkout no basta.

### 3:50–4:20 — El navegador hace el widget

| Haz                                                                      | Dónde              |
| ------------------------------------------------------------------------ | ------------------ |
| Click botones/marcadores nativos (Chrome 154+)                           | Carrusel recargado |
| Editor: `@supports (scroll-marker-group: after tabs)` y el fallback snap | `main.css`         |
| Señala `carousel.ts` un segundo: «este archivo ya no se ejecuta.»        | Editor             |

**Ideas, no las leas**

- `after tabs` — Chrome 154, patrón tablist. `links` es el default.
- Firefox y Safari: se desliza. No hay puntos mágicos. Por eso `@supports`.
- ~71 % global, solo Chromium. Progressive enhancement, no “listo para todo el mundo”.

### 4:20–4:45 — Cierre con problema abierto

| Haz                              | Dónde  |
| -------------------------------- | ------ |
| CSS `@supports` a pantalla       | Editor |
| Corta en pregunta. No resuelvas. | Cámara |

**Cierre (elige uno):**

- «Firefox y Safari todavía no. ¿Shippeamos el CSS y el fallback, o esperamos? Eso es producto, no sintaxis.»
- «¿Cuándo _sí_ hace falta JS en un carrusel? Autoplay, analytics, infinite loop… eso es la siguiente conversación.»
- «La próxima: este mismo `main` pide el catálogo cinco veces en cascada. Borrar JS no arregla una red tonta.»

No digas «eso es todo». Corta en la pregunta.

### Buffer 30 s (si vas sobrado)

- Un número: JS de producción en `main` **213 kB**. Hoy no hace falta Lighthouse.
- Si insisten: Lighthouse va sobre **`pnpm preview`**, no sobre `dev`. En esta máquina `main` vs `solucion` fue **69 → 94**. El LCP se mueve por imágenes; el dato de _esta_ clase es el widget.
- «En casa: Coverage, tres clicks, y la rama `fix/01-carrusel-css` si no quieres editar.»

---

## Extra / siguiente clase (no grabar hoy)

| Siguiente                                | Rama               | Gancho de 15 s             |
| ---------------------------------------- | ------------------ | -------------------------- |
| Cascada de `await`, el mismo GET N veces | `fix/02-fetch`     | Network: 5 barras en serie |
| JPEG de 2 MB, lodash+moment              | `fix/03-carga`     | LCP 12,6 s en `main`       |
| `innerHTML` XSS, API key `sk_live_FAKE`  | `fix/04-seguridad` | Sources → `FAKE`           |
| Todo junto                               | `solucion`         | 69 → 94, 17,8 MB → 126 KiB |

Imprimible: [`hoja-de-ruta.md`](hoja-de-ruta.md). Pegar: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).
