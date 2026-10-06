# Guión de clase Platzi (~4–4,5 min)

Tema **único**: borrar el JavaScript de un carrusel de productos (`scroll-marker-group` vs el widget a mano). Nada de fetch, seguridad ni Lighthouse completo en vivo.

No es un discurso. Es un mapa de **acciones** + frases sueltas. No lo leas.

## En los primeros 10 segundos

Pantalla ya abierta: tienda en `http://127.0.0.1:4173`, carrusel a la vista. Cámara + pantalla.

**Frase 1 (el caso, no el hola):**
«Este carrusel funciona. Lo podría haber escrito una IA. El problema no es que falle: es que le estamos pagando al hilo principal por un trabajo que el navegador ya sabe hacer.»

**Qué va a poder hacer el estudiante (ya):**
«Al terminar vas a poder mirar un carrusel, contar cuánto JS es “el widget”, y sustituirlo por CSS nativo con un fallback.»

**Idea central (antes del segundo 10):**
Borrar JavaScript sigue siendo una de las mejores optimizaciones de frontend.

---

## Checklist (5 min antes de grabar)

- [ ] Rama: `main` (`git switch main && pnpm preview`). Puerto `:4173`.
- [ ] Chrome **154+** (los modos `tabs` / `links` de `scroll-marker-group` salieron ~154). Si es 135–153, los marcadores existen; el modo `tabs` no.
- [ ] Editor: fuente **18–20 px**. Nadie lee 12 px en grabación.
- [ ] Browser: zoom **125–150 %**. DevTools desacoplado o a la derecha, grande.
- [ ] Paneles listos: **Performance** y, en otra pestaña de DevTools, **Coverage** (o el recuento de JS en Network).
- [ ] Terminal con `git switch fix/01-carrusel-css` escrito, sin Enter.
- [ ] Archivos abiertos en pestañas: `src/carousel.ts` (main) y, para después, el CSS del carrusel en `src/styles/main.css` de `fix/01-carrusel-css`.
- [ ] No leas esto. Improvise desde los recuadros «ideas».

---

## Analogía (una sola, toda la clase)

El navegador es la cinta del sushi: ya mueve los platos. Nosotros contratamos a un camarero (`activeIndex`, `scrollTo`, ARIA, puntos) para llevar cada plato a mano. El camarero cobra en **hilo principal**.

Dila de dos formas:

1. «Le estamos pagando a un camarero por un trabajo que la cinta ya hace.»
2. «El mejor JS del carrusel es el que no enviamos.»

---

## Pregunta al estudiante (antes de mostrar el CSS)

Tras enseñar `carousel.ts`, **párate**:

«Si el navegador ya hace scroll, ya hace botones y ya sabe cuál lámina está a la vista… ¿cuál de estas líneas _tiene_ que ser JavaScript?»

Cuenta hasta tres. Luego: «ninguna de las del widget. El JS que queda es pintar datos.»

---

## Minuto a minuto — acciones (no texto para leer)

### 0:00–0:40 — El carrusel “va bien”

| Haz                                                           | Dónde                        |
| ------------------------------------------------------------- | ---------------------------- |
| Click prev / next, puntos, teclado si da tiempo               | Browser, carrusel Destacados |
| «Se ve bien. Eso no basta.»                                   | —                            |
| F12 → Performance → Record → 2–3 clicks de next → Stop        | DevTools Performance         |
| Señalá el recuadro del click / scripting (aunque sea pequeño) | Main thread                  |

**Ideas, no las leas**

- Funciona. El bug es el coste, no el crash.
- Cada click es trabajo nuestro en el hilo que también pinta.
- [Hueco anécdota] «La última landing que revisé, generada con IA, tenía exactamente este archivo: estado, ARIA y `scrollTo` para tres fotos.»

### 0:40–1:50 — El impuesto del widget

| Haz                                                                                                         | Dónde                     |
| ----------------------------------------------------------------------------------------------------------- | ------------------------- |
| Alt-tab al editor                                                                                           | `src/carousel.ts`         |
| Scroll rápido: `activeIndex`, `setActive`, dots, `keydown`, `aria-selected`                                 | Mismo archivo             |
| Network → JS: el bundle de main (~213 kB, lodash/moment también pesan; el _punto_ es el widget + JS de más) | DevTools Network, tipo JS |
| No te metas en fetch ni en las imágenes                                                                     | —                         |

**Ideas, no las leas**

- Estado, eventos, sincronizar scroll, foco, ARIA: el lado izquierdo del post.
- No es que esté mal escrito. Es que **no debería existir**.
- Checkbox no lo programamos en JS. El carrusel, cada vez menos.

### 1:50–2:10 — Pregunta (silencio)

| Haz                                                 | Dónde             |
| --------------------------------------------------- | ----------------- |
| Deja `carousel.ts` a pantalla                       | Editor            |
| Lanza la pregunta. Espera. No rellenes el silencio. | Cámara un segundo |

### 2:10–3:40 — El navegador hace el widget

| Haz                                                                                   | Dónde                                             |
| ------------------------------------------------------------------------------------- | ------------------------------------------------- |
| Terminal: `git switch fix/01-carrusel-css` → `pnpm preview` (o recarga si ya compiló) | Terminal + browser                                |
| Recarga la tienda. Mismos productos. **Sin** botones en el HTML                       | Browser                                           |
| Click a los botones/marcadores nativos (Chrome 154+)                                  | Carrusel                                          |
| Editor: `src/styles/main.css` — busca `scroll-marker-group`                           | CSS                                               |
| Señala `@supports` y el fallback `scroll-snap`                                        | Mismo archivo                                     |
| «El JS que queda pinta `<li>`. El widget lo borramos.»                                | `src/render.ts` / `renderCarousel` si apuntas 2 s |

**Ideas, no las leas**

- `scroll-marker-group: after tabs` — Chrome 154, patrón tablist. `links` es el default.
- `::scroll-button(left)` / `(right)` y `::scroll-marker:target-current`.
- Firefox y Safari: se desliza (scroll-snap). No hay puntos mágicos. Por eso `@supports`.
- ~71 % global, solo Chromium. No es “listo para todo el mundo”: es progressive enhancement.

```css
.carousel {
  overflow-x: auto;
  scroll-snap-type: x mandatory;
  scroll-marker-group: after tabs;
}
.carousel::scroll-button(left) {
  content: '‹' / 'Anterior';
}
.slide::scroll-marker:target-current {
  background: var(--accent);
}
```

(No pegues el bloque entero en vivo. Enséñalo ya escrito.)

### 3:40–4:20 — Cuánto costaba el JS de más

| Haz                                                                                                                                           | Dónde                                   |
| --------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------- |
| Coverage (Ctrl+Shift+P → “Show Coverage”) → recarga, interactúa el carrusel en `main` si volviste, o enseña el número ya medido               | DevTools                                |
| **Un** número, no la tabla: JS de producción en `main` **213 kB** (gzip ~72 kB). En la rama del carrusel CSS el widget desaparece del bundle. | Network o terminal `ls -lh dist/assets` |
| Si el Performance del inicio sigue abierto: «ese work de click ya no es nuestro.»                                                             | Performance                             |

**Ideas, no las leas**

- No hace falta Lighthouse ahora. Un tamaño de JS basta.
- El hilo principal es el único camarero de la sala: menos encargos, más frames.

### 4:20–4:45 — Cierre con problema abierto

| Haz                                    | Dónde  |
| -------------------------------------- | ------ |
| Vuelve 1 s al CSS `@supports`          | Editor |
| Corta. Pregunta al aire. No resuelvas. | Cámara |

**Cierre (elige uno, improvisado):**

- «Firefox y Safari todavía no. ¿Shippeamos el CSS y el fallback, o esperamos? Eso es producto, no sintaxis.»
- «¿Cuándo _sí_ hace falta JS en un carrusel? Autoplay, analytics, infinite loop… eso es la siguiente conversación.»
- «La próxima: este mismo `main` pide el catálogo cinco veces en cascada. Borrar JS no arregla una red tonta.»

No digas «eso es todo» ni «gracias por ver». Corta en la pregunta.

### Buffer 30 s (si vas sobrado)

Un flash, no una auditoría:

- Lighthouse sobre **`pnpm preview`**, no sobre `dev`.
- En esta máquina: Performance **69 → 94**, transferido **17,8 MB → 126 KiB** (`main` vs `solucion`). El LCP se mueve mucho por imágenes; para _esta_ clase el dato útil es el JS (**213 kB**).
- «Si te da tiempo en casa: `fix/01-carrusel-css` vs `main`, Coverage, tres clicks.»

---

## Extra / siguiente clase (no grabar hoy)

El repo tiene más heridas a propósito. **No las abras en estos 5 minutos.**

| Siguiente                                                          | Rama               | Gancho de 15 s                                        |
| ------------------------------------------------------------------ | ------------------ | ----------------------------------------------------- |
| Cascada de `await`, el mismo GET N veces, JSON con emails y costes | `fix/02-fetch`     | Network: 5 barras en serie, `/api/products` dos veces |
| JPEG de 2 MB, lodash+moment, fuente bloqueante                     | `fix/03-carga`     | LCP 12,6 s en `main`                                  |
| `innerHTML` + payload XSS, API key `sk_live_FAKE` en el bundle     | `fix/04-seguridad` | Sources → busca `FAKE`                                |
| Todo junto                                                         | `solucion`         | 69 → 94, 17,8 MB → 126 KiB                            |

Guía imprimible en paralelo: [`hoja-de-ruta.md`](hoja-de-ruta.md). Mapa del repo: [`README.md`](../README.md).
