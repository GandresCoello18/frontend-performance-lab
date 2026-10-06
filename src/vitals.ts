import { onCLS, onINP, onLCP, onTTFB, type Metric } from 'web-vitals';

async function send(metric: Metric): Promise<void> {
  try {
    await fetch('/api/metrics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: metric.name,
        value:
          Math.round(metric.value * (metric.name === 'CLS' ? 1000 : 1)) /
          (metric.name === 'CLS' ? 1000 : 1),
        rating: metric.rating,
        id: metric.id,
        navigationType: metric.navigationType,
        href: location.href,
        ts: Date.now(),
      }),
      keepalive: true,
    });
  } catch {
    // El demo no debe romper la página si falla el faro.
  }
}

/** OBSERVABILIDAD: reporta LCP, INP, CLS y TTFB al API para comparar antes/después. */
export function initVitals(): void {
  onLCP(send);
  onINP(send);
  onCLS(send);
  onTTFB(send);
}
