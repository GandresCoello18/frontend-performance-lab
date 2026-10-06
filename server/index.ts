import { serve } from '@hono/node-server';
import { serveStatic } from '@hono/node-server/serve-static';
import { createHash } from 'node:crypto';
import { Hono } from 'hono';
import { compress } from 'hono/compress';
import type { Context } from 'hono';
import { allReviews, categories, products, searchProducts } from './data.ts';
import { toPublicProduct, toPublicReview } from './dto.ts';
import { API_DELAY_MS, sleep } from './util.ts';

export const app = new Hono();

app.use('*', async (c, next) => {
  c.header('Access-Control-Allow-Origin', '*');
  c.header('Access-Control-Allow-Methods', '*');
  c.header('Access-Control-Allow-Headers', '*');
  if (c.req.method === 'OPTIONS') {
    return c.body(null, 204);
  }
  await next();
});

app.use('/api/*', compress());

app.use('/api/*', async (_, next) => {
  await sleep(API_DELAY_MS);
  await next();
});

const PUBLIC_FIELDS = ['id', 'name', 'shortDescription', 'price', 'image', 'category'] as const;

function digest(payload: unknown): string {
  return `"${createHash('sha1').update(JSON.stringify(payload)).digest('hex')}"`;
}

function jsonCached(c: Context, payload: unknown, maxAge = 30) {
  const tag = digest(payload);
  c.header('ETag', tag);
  c.header('Cache-Control', `public, max-age=${maxAge}, stale-while-revalidate=120`);
  if (c.req.header('If-None-Match') === tag) {
    return c.body(null, 304);
  }
  return c.json(payload);
}

function pickFields(item: Record<string, unknown>, fields: string[]): Record<string, unknown> {
  if (fields.length === 0) return item;
  const out: Record<string, unknown> = {};
  for (const field of fields) {
    if (field in item) out[field] = item[field];
  }
  return out;
}

app.get('/api/health', (c) => c.json({ ok: true }));

app.get('/api/products', (c) => {
  const q = c.req.query('q') ?? '';
  const page = Math.max(1, Number(c.req.query('page') ?? '1'));
  const limit = Math.min(24, Math.max(1, Number(c.req.query('limit') ?? '12')));
  const fields = (c.req.query('fields') ?? '')
    .split(',')
    .map((f) => f.trim())
    .filter((f) => (PUBLIC_FIELDS as readonly string[]).includes(f));

  const matches = searchProducts(q).map(toPublicProduct);
  const start = (page - 1) * limit;
  const slice = matches
    .slice(start, start + limit)
    .map((item) => pickFields({ ...item } as Record<string, unknown>, fields));
  return jsonCached(c, {
    items: slice,
    page,
    limit,
    total: matches.length,
  });
});

app.get('/api/featured', (c) => jsonCached(c, products.slice(0, 5).map(toPublicProduct)));

app.get('/api/reviews', (c) => jsonCached(c, allReviews().map(toPublicReview)));

app.get('/api/categories', (c) =>
  jsonCached(
    c,
    categories.map((cat) => ({ id: cat.id, name: cat.name })),
  ),
);

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
  serve({ fetch: app.fetch, port }, (info) => {
    console.info(`API Casa Lumen en http://127.0.0.1:${info.port}`);
  });
}
