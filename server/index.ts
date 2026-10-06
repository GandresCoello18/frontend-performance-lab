import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { allReviews, categories, products, searchProducts } from './data.ts';
import { API_DELAY_MS, sleep } from './util.ts';

export const app = new Hono();

// PROBLEMA #4: CORS permisivo (cualquier origen, cualquier cabecera/método).
app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', '*');
  c.header('Access-Control-Allow-Headers', '*');
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  await next();
});

// PROBLEMA #4: sin cabeceras de seguridad (CSP, X-Content-Type-Options, Referrer-Policy, frame-ancestors).
// PROBLEMA #2: sin Cache-Control ni ETag; cada visita vuelve a bajar el JSON completo.

app.use('/api/*', async (_, next) => {
  await sleep(API_DELAY_MS);
  await next();
});

app.get('/api/health', (c) => c.json({ ok: true }));

app.get('/api/products', async (c) => {
  const q = c.req.query('q') ?? '';
  const jitter = Number(c.req.query('slow') ?? '0');
  // PROBLEMA #2: jitter opcional para que la búsqueda muestre condiciones de carrera.
  if (q) {
    const extra =
      process.env.VITEST === 'true' ? 0 : 120 + Math.floor(Math.random() * 500) + jitter;
    await sleep(extra);
    return c.json(searchProducts(q));
  }
  // PROBLEMA #2: sobre-fetch (objetos enormes: reseñas, proveedor, costes, emails).
  // PROBLEMA #4: se filtran campos sensibles que la UI no usa.
  return c.json(products);
});

app.get('/api/featured', (c) => c.json(products.slice(0, 5)));

app.get('/api/reviews', (c) => c.json(allReviews()));

app.get('/api/categories', (c) => c.json(categories));

app.post('/api/metrics', async (c) => {
  const body = await c.req.json().catch(() => ({}));
  // OBSERVABILIDAD: el servidor deja constancia de LCP/INP/CLS/TTFB para la clase.
  console.info('[vitals]', JSON.stringify(body));
  return c.json({ ok: true });
});

const isProd = process.env.NODE_ENV === 'production';
const port = Number(process.env.PORT ?? (isProd ? 4173 : 3001));

if (isProd) {
  app.use('/assets/*', serveStatic({ root: './dist' }));
  app.use('/images/*', serveStatic({ root: './dist' }));
  app.use('/legacy-analytics.js', serveStatic({ root: './dist' }));
  app.get('*', serveStatic({ root: './dist', path: 'index.html' }));
}

if (process.env.VITEST !== 'true') {
  serve({ fetch: app.fetch, port }, (info) => {
    console.info(`API Casa Lumen en http://127.0.0.1:${info.port}`);
  });
}
