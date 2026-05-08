/** Deterministic noise for “unreliable instrument” readouts — not cryptographic. */

export function hashSeed(parts: string[]): number {
  let h = 2166136261 >>> 0;
  for (const p of parts) {
    for (let i = 0; i < p.length; i++) {
      h ^= p.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  return () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function formatCorruptedPrice(rand: () => number): string {
  const whole = Math.floor(rand() * 900 + 100);
  const frac = Math.floor(rand() * 100)
    .toString()
    .padStart(2, '0');
  if (rand() > 0.65) {
    const mask = rand() > 0.5 ? '█' : '▓';
    const cut = Math.floor(rand() * 4) + 1;
    const broken = (whole + '.' + frac).split('');
    for (let i = 0; i < cut; i++) {
      const j = Math.floor(rand() * broken.length);
      broken[j] = mask;
    }
    return broken.join('');
  }
  return `${whole}.${frac}`;
}
