# Guión de clase Platzi (~4–4,5 min)

Tema **único**: el **fetch** de la landing — cascada de `await` y el mismo GET repetido. El carrusel JS **se queda**. Es el teaser de la próxima clase (CSS `scroll-marker-group`).

Se edita **en `main`**, `pnpm dev`, HMR. Un pegado. Snippets: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).

No es un discurso. Acciones + frases. No lo leas.

## En los primeros 10 segundos

Pantalla: tienda en `http://127.0.0.1:5173` con Network ya abierto (Fetch/XHR). Cámara + pantalla.

**Frase 1 (el caso, no el hola):**
«La tienda se ve bien. Tarda. No es el CSS: son cinco idas al servidor en fila, y una de ellas es pedir lo mismo otra vez.»

**Qué va a poder hacer el estudiante (ya):**
«Vas a leer un Network, cazar una cascada y un GET duplicado, y dejarlo en una ronda con `Promise.all`.»

**Idea central (antes del segundo 10):**
Medir → pedir en paralelo → no repetir.

---

## Checklist (5 min antes)

- [ ] `main` limpia. **`pnpm dev`** → `:5173`.
- [ ] Zoom 125–150 %. Editor 18–20 px. Pestaña: `src/main.ts`.
- [ ] DevTools **Network**: Disable cache, filtro Fetch/XHR. Consola visible.
- [ ] Segunda pantalla: este guión + checklist + hoja de ruta.
- [ ] Plan B, sin Enter: `git checkout -- src/main.ts`
- [ ] No leas. Pega.

---

## Analogía (una sola)

El barista. Pedimos café, esperamos, luego el té, esperamos, luego el café **otra vez**. Cuatro colas abiertas (`Promise.all`) y no repetir el café.

Dila de dos formas:

1. «Estamos haciendo cola cinco veces para lo que cabía en una bandeja.»
2. «Pedir en paralelo no basta: también hay que no pedir dos veces lo mismo.»

---

## Pregunta al chat (antes de pegar)

Con Network a pantalla (las dos barras `/api/products`):

«¿Cuántas veces pedimos lo mismo?»

Espera. Luego: «Dos. Y las otras tres ni siquiera esperaban datos de la anterior. Era teatro de `await`.»

---

## Minuto a minuto — acciones

### 0:00–0:45 — Tarda, y se ve en Network

| Haz                                                                           | Dónde             |
| ----------------------------------------------------------------------------- | ----------------- |
| Reload duro. No hables hasta que pinten las barras                            | Network Fetch/XHR |
| Señala la **escalera**: featured → products → reviews → categories → products | Waterfall         |
| Hover las dos `/api/products`                                                 | Mismo URL         |

**Ideas, no las leas**

- Delay de demo ~380 ms/request: 5 en serie ≈ 1,9 s. Inventado, pero honesto.
- [Hueco anécdota] «En la última landing “hecha con IA” vi exactamente esto: cada componente se traía el catálogo solo.»

### 0:45–1:50 — Diagnóstico en el editor

| Haz                                                                          | Dónde         |
| ---------------------------------------------------------------------------- | ------------- |
| `src/main.ts` — primer `PROBLEMA #2`: cuatro `await` seguidos                | Editor        |
| Scroll al segundo: `again = await getJson('/api/products')` + `initCarousel` | Mismo archivo |
| «El carrusel necesita datos. No necesita un viaje nuevo.»                    | —             |

**Ideas, no las leas**

- `await` en serie solo si B depende de A. Aquí no.
- El widget JS del carrusel **hoy no se toca**. Solo de dónde come.

### 1:50–2:10 — Pregunta (silencio)

| Haz                                       | Dónde            |
| ----------------------------------------- | ---------------- |
| Network o las dos llamadas a pantalla     | Browser / editor |
| «¿Cuántas veces pedimos lo mismo?» Calla. | Cámara           |

### 2:10–3:20 — Un pegado

| Haz                                                       | Dónde            |
| --------------------------------------------------------- | ---------------- |
| Sustituye los dos bloques #2 por el snippet del checklist | `src/main.ts`    |
| Guarda. Vite recarga                                      | Editor → browser |
| Si no recarga: Ctrl+Shift+R                               | Browser          |

**Ideas, no las leas** (poco habla mientras pegas)

- `Promise.all`: una ronda.
- `initCarousel(..., featured)`: mismos destacados, cero GET extra.
- El archivo `carousel.ts` sigue ahí. Próxima clase.

Si explota: Plan B (`git checkout -- src/main.ts`). Último recurso: `git switch fix/02-fetch` (no `fix/01`).

### 3:20–4:15 — Network otra vez + un número

| Haz                                                                  | Dónde   |
| -------------------------------------------------------------------- | ------- |
| Reload. Cuatro barras **juntas**. Un `/api/products`                 | Network |
| Consola: `[perf] cascada-inicial` — ~380 ms vs ~1,9 s de antes       | Consola |
| Click prev/next del carrusel: **sigue en JS**. «Eso no era el tema.» | Landing |

**Ideas, no las leas**

- El número de hoy es la **duration**, no Lighthouse.
- Lighthouse es `pnpm preview`. Hoy medimos la cascada.

### 4:15–4:45 — Cierre abierto

| Haz                                | Dónde   |
| ---------------------------------- | ------- |
| Carrusel a pantalla, un segundo    | Browser |
| Corta en la próxima. No resuelvas. | Cámara  |

**Cierre:**
«Medir, pedir en paralelo, no repetir. Este carrusel sigue siendo un widget a mano: estado, botones, ARIA. La próxima: borrarlo. El navegador ya sabe hacer `scroll-marker-group`.»

No digas «gracias por ver». Corta.

### Buffer 30 s

- Caché/dedupe y `fields`: «en casa, rama `fix/02-fetch`. Hoy no cabía sin tocar el API.»
- Un flash de cifra global si insisten: `main` vs `solucion` Lighthouse **69 → 94**; el LCP es sobre todo imágenes. El dato de _esta_ clase es ~1,9 s → ~380 ms de cascada.

---

## Extra / siguiente clase (no grabar hoy)

| Siguiente                                         | Rama                  | Gancho                               |
| ------------------------------------------------- | --------------------- | ------------------------------------ |
| Borrar el JS del carrusel (`scroll-marker-group`) | `fix/01-carrusel-css` | El widget que acabamos de dejar vivo |
| Caché, ETag, debounce, DTO                        | `fix/02-fetch`        | Lo que no pegamos hoy                |
| JPEG 2 MB, lodash+moment                          | `fix/03-carga`        | LCP 12,6 s                           |
| XSS `innerHTML`, `sk_live_FAKE`                   | `fix/04-seguridad`    | Sources → `FAKE`                     |

Imprimible: [`hoja-de-ruta.md`](hoja-de-ruta.md). Pegar: [`checklist-edicion-vivo.md`](checklist-edicion-vivo.md).
