function pad(n: number): string {
  return n.toString().padStart(2, '0');
}

export function fakeSessionId(): string {
  const t = new Date();
  return `sess-${t.getFullYear()}${pad(t.getMonth() + 1)}${pad(t.getDate())}-${Math.random()}`;
}

export const UNUSED_COPY = [
  'Este módulo se importa entero y apenas se usa.',
  'Sirve para inflar el bundle de la versión problemática.',
];
