'use client';

import { useEffect, useRef } from 'react';

/** Extremely weak film grain — low-frequency redraws only. */
export function NoiseFilm() {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    let interval: ReturnType<typeof setInterval>;

    const paint = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio, 1.5);
      canvas.width = Math.floor(w * dpr);
      canvas.height = Math.floor(h * dpr);
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.scale(dpr, dpr);
      const img = ctx.createImageData(w, h);
      const buf = img.data;
      for (let i = 0; i < buf.length; i += 4) {
        const v = Math.random() * 28;
        buf[i] = v;
        buf[i + 1] = v;
        buf[i + 2] = v;
        buf[i + 3] = 10;
      }
      ctx.putImageData(img, 0, 0);
    };

    paint();
    interval = setInterval(paint, 480);
    window.addEventListener('resize', paint);
    return () => {
      clearInterval(interval);
      window.removeEventListener('resize', paint);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      className="pointer-events-none fixed inset-0 z-[1] opacity-[0.06] mix-blend-overlay"
      aria-hidden
    />
  );
}
