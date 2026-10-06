import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { Hono } from 'hono';
import { allReviews, categories, products, searchProducts } from './data.ts';
import { publicCategory, publicProduct, publicReview } from './dto.ts';
import { API_DELAY_MS, sleep } from './util.ts';

export const app = new Hono();

const ALLOWED_ORIGINS = new Set(
  (process.env.API_ORIGIN ?? 'http://127.0.0.1:5173,http://localhost:5173,http://127.0.0.1:4173')
    .split(',')
    .map((origin) => origin.trim())
    .filter(Boolean),
);

const CSP = [
  "default-src 'self'",
  "script-src 'self'",
  "style-src 'self' https://fonts.googleapis.com",
  "font-src 'self' https://fonts.gstatic.com",
  "img-src 'self' data:",
  "connect-src 'self'",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
].join('; ');

app.use('*', async (c, next) => {
  const origin = c.req.header('Origin');
  if (origin && ALLOWED_ORIGINS.has(origin)) {
    c.header('Access-Control-Allow-Origin', origin);
    c.header('Vary', 'Origin');
    c.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
    c.header('Access-Control-Allow-Headers', 'Content-Type');
  }
  c.header('Content-Security-Policy', CSP);
  c.header('X-Content-Type-Options', 'nosniff');
  c.header('Referrer-Policy', 'strict-origin-when-cross-origin');
  c.header('X-Frame-Options', 'DENY');
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  await next();
});

app.use('/api/*', async (_, next) => {
  await sleep(API_DELAY_MS);
  await next();
});

app.get('/api/health', (c) => c.json({ ok: true }));

app.get('/api/products', async (c) => {
  const q = c.req.query('q') ?? '';
  const jitter = Number(c.req.query('slow') ?? '0');
  if (q) {
    const extra =
      process.env.VITEST === 'true' ? 0 : 120 + Math.floor(Math.random() * 500) + jitter;
    await sleep(extra);
    return c.json(searchProducts(q).map(publicProduct));
  }
  return c.json(products.map(publicProduct));
});

app.get('/api/featured', (c) => c.json(products.slice(0, 5).map(publicProduct)));

app.get('/api/reviews', (c) => c.json(allReviews().map(publicReview)));

app.get('/api/categories', (c) => c.json(categories.map(publicCategory)));

app.post('/api/metrics', async (c) => {
  const body = await c.req.json().catch(() => ({}));
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
  if (!process.env.PAYMENTS_SECRET) {
    console.info('[env] PAYMENTS_SECRET no está definido; el cobro no vive en el front.');
  }
  serve({ fetch: app.fetch, port }, (info) => {
    console.info(`API Casa Lumen en http://127.0.0.1:${info.port}`);
  });
}
