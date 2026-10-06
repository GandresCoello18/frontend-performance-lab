export const API_DELAY_MS = process.env.VITEST === 'true' ? 0 : 380;

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Texto largo a propósito para inflar el JSON (sobre-fetch). */
export function lorem(seed: string, paragraphs = 6): string {
  const base = `${seed}. En Casa Lumen cuidamos cada detalle: materiales nobles, líneas simples y una paleta cálida pensada para el día a día. Esta ficha incluye historia de diseño, medidas, instrucciones de cuidado, compatibilidad, preguntas frecuentes, notas de almacén y un relato extendido que el listado de la tienda nunca muestra. `;
  return Array.from({ length: paragraphs }, (_, i) => `${base} Bloque ${i + 1}.`).join('\n\n');
}
