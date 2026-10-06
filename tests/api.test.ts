import { describe, expect, it } from 'vitest';
import { app } from '../server/index.ts';
import { products } from '../server/data.ts';
import { debounce } from '../src/fetch-client.ts';

describe('API Casa Lumen', () => {
  it('GET /api/health responde ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it('GET /api/products pagina y no filtra datos de proveedor', async () => {
    const res = await app.request('/api/products?page=1&limit=4');
    expect(res.status).toBe(200);
    const body = (await res.json()) as {
      items: Array<Record<string, unknown>>;
      total: number;
    };
    expect(body.total).toBe(products.length);
    expect(body.items).toHaveLength(4);
    expect(body.items[0]).not.toHaveProperty('supplier');
    expect(body.items[0]).not.toHaveProperty('internalNotes');
    expect(body.items[0]).toHaveProperty('name');
  });

  it('GET /api/products responde 304 con If-None-Match', async () => {
    const first = await app.request('/api/products');
    const tag = first.headers.get('ETag');
    expect(tag).toBeTruthy();
    expect(first.headers.get('Cache-Control')).toMatch(/max-age/);
    const again = await app.request('/api/products', { headers: { 'If-None-Match': tag ?? '' } });
    expect(again.status).toBe(304);
  });

  it('GET /api/products?q=lámpara filtra por nombre', async () => {
    const res = await app.request('/api/products?q=l%C3%A1mpara');
    const body = (await res.json()) as { items: Array<{ id: string }> };
    expect(body.items.some((p) => p.id === 'lampara')).toBe(true);
  });

  it('POST /api/metrics acepta un faro de web-vitals', async () => {
    const res = await app.request('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'LCP', value: 3200, rating: 'poor' }),
    });
    expect(res.status).toBe(200);
  });
});

describe('debounce', () => {
  it('agrupa llamadas rápidas', async () => {
    const seen: string[] = [];
    const fn = debounce((value) => seen.push(value), 20);
    fn('a');
    fn('ab');
    fn('abc');
    await new Promise((r) => setTimeout(r, 40));
    expect(seen).toEqual(['abc']);
  });
});
