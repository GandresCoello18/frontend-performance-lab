export function formatPrice(amount: number, currency = 'EUR'): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency,
  }).format(amount);
}

export function headline(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function todayLabel(date = new Date()): string {
  return new Intl.DateTimeFormat('es-ES', { dateStyle: 'long' }).format(date);
}

export function slugify(value: string): string {
  return value
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}
