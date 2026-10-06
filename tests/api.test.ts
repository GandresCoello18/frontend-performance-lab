import { describe, expect, it } from 'vitest';
import { app } from '../server/index.ts';
import { products } from '../server/data.ts';

describe('API Casa Lumen', () => {
  it('GET /api/health responde ok', async () => {
    const res = await app.request('/api/health');
    expect(res.status).toBe(200);
    await expect(res.json()).resolves.toEqual({ ok: true });
  });

  it('GET /api/products devuelve el catálogo con los campos de la ficha', async () => {
    const res = await app.request('/api/products');
    expect(res.status).toBe(200);
    const body = (await res.json()) as Array<{ id: string; name: string; price: number }>;
    expect(body.length).toBe(products.length);
    expect(body[0]).toMatchObject({
      id: expect.any(String),
      name: expect.any(String),
      price: expect.any(Number),
    });
  });

  it('GET /api/products?q=lámpara filtra por nombre', async () => {
    const res = await app.request('/api/products?q=l%C3%A1mpara');
    const body = (await res.json()) as typeof products;
    expect(body.some((p) => p.id === 'lampara')).toBe(true);
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
