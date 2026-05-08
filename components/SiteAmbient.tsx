'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef } from 'react';

/** Strip GitHub Pages `basePath` so `/tbody/u01` → `/u01`. */
function normalizePath(pathname: string | null): string {
  let p = pathname || '/';
  const base = (process.env.NEXT_PUBLIC_BASE_PATH || '').trim().replace(/\/$/, '');
  if (base && p.startsWith(base)) {
    p = p.slice(base.length) || '/';
    if (!p.startsWith('/')) p = `/${p}`;
  }
  return p;
}

function isCorridorRoute(norm: string): boolean {
  return /^\/u0[1-4](?:\/|$)/i.test(norm);
}

/** Hall-ish impulse for ConvolverNode (~2s decay). */
function makeImpulseBuffer(ctx: AudioContext): AudioBuffer {
  const len = Math.floor(ctx.sampleRate * 2.2);
  const buf = ctx.createBuffer(2, len, ctx.sampleRate);
  for (let ch = 0; ch < 2; ch++) {
    const d = buf.getChannelData(ch);
    for (let i = 0; i < len; i++) {
      const t = i / len;
      d[i] = (Math.random() * 2 - 1) * Math.pow(1 - t, 2.4) * 0.82;
    }
  }
  return buf;
}

/**
 * Dark-forest bed (no UI): starts after first pointer/key on non-corridor routes only.
 */
export function SiteAmbient() {
  const pathname = usePathname();
  const pathNorm = normalizePath(pathname);
  const onCorridor = isCorridorRoute(pathNorm);
  const ctxRef = useRef<AudioContext | null>(null);
  const stoppableRef = useRef<Array<{ stop: () => void }>>([]);

  const stop = useCallback(() => {
    stoppableRef.current.forEach((s) => {
      try {
        s.stop();
      } catch {
        /* */
      }
    });
    stoppableRef.current = [];
    void ctxRef.current?.close();
    ctxRef.current = null;
  }, []);

  const start = useCallback(() => {
    stop();
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    void ctx.resume();

    const master = ctx.createGain();
    master.gain.value = 0.26;

    const basesHz = [20.6, 41.2, 61.88, 92.5, 116.54];
    const oscs: OscillatorNode[] = [];
    basesHz.forEach((hz, i) => {
      const o = ctx.createOscillator();
      o.type = i <= 1 ? 'sine' : 'triangle';
      o.frequency.value = hz;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.38 : i === 1 ? 0.12 : 0.055 + i * 0.018;
      o.connect(g);
      g.connect(master);
      o.start(0);
      oscs.push(o);
    });

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.028;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.018;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start(0);
    oscs.push(lfo);

    const bufLen = ctx.sampleRate * 8;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      data[i] = (Math.random() * 2 - 1) * 0.042;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const bp = ctx.createBiquadFilter();
    bp.type = 'bandpass';
    bp.frequency.value = 420;
    bp.Q.value = 0.55;
    const ng = ctx.createGain();
    ng.gain.value = 0.085;
    noise.connect(bp);
    bp.connect(ng);
    ng.connect(master);
    noise.start(0);

    const lfoF = ctx.createOscillator();
    lfoF.type = 'sine';
    lfoF.frequency.value = 0.019;
    const lfoFG = ctx.createGain();
    lfoFG.gain.value = 95;
    lfoF.connect(lfoFG);
    lfoFG.connect(bp.frequency);
    lfoF.start(0);
    oscs.push(lfoF);

    const conv = ctx.createConvolver();
    conv.buffer = makeImpulseBuffer(ctx);
    const dry = ctx.createGain();
    const wet = ctx.createGain();
    dry.gain.value = 0.72;
    wet.gain.value = 0.38;
    master.connect(dry);
    master.connect(conv);
    conv.connect(wet);
    const merge = ctx.createGain();
    dry.connect(merge);
    wet.connect(merge);
    merge.connect(ctx.destination);

    stoppableRef.current = [
      {
        stop: () => {
          oscs.forEach((o) => {
            try {
              o.stop();
            } catch {
              /* */
            }
          });
        },
      },
      {
        stop: () => {
          try {
            noise.stop();
          } catch {
            /* */
          }
        },
      },
    ];

    return ctx;
  }, [stop]);

  useEffect(() => {
    if (onCorridor) {
      stop();
      return;
    }

    const unlock = () => {
      const ctx = start();
      void ctx?.resume();
    };

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') return;
      unlock();
    };

    window.addEventListener('pointerdown', unlock, { once: true, passive: true });
    window.addEventListener('keydown', onKey, { once: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', onKey);
      stop();
    };
  }, [pathNorm, onCorridor, start, stop]);

  return null;
}
