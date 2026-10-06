import { describe, expect, it } from 'vitest';
import { formatPrice, slugify } from '../src/format.ts';

describe('formatPrice', () => {
  it('formatea euros en locale es-ES', () => {
    const value = formatPrice(189);
    expect(value).toMatch(/189/);
    expect(value).toMatch(/€/);
  });
});

describe('slugify', () => {
  it('quita acentos y espacios', () => {
    expect(slugify('Auriculares Nórdica')).toBe('auriculares-nordica');
  });
});
