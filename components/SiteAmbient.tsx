'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n-context';

/** Low-register minor cluster + noise — instrumental “dark forest” bed (procedural, no external samples). */
export function SiteAmbient() {
  const pathname = usePathname();
  const { t } = useI18n();
  const ctxRef = useRef<AudioContext | null>(null);
  const stoppableRef = useRef<Array<{ stop: () => void }>>([]);
  const [on, setOn] = useState(false);

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
    setOn(false);
  }, []);

  const start = useCallback(() => {
    stop();
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;

    const master = ctx.createGain();
    master.gain.value = 0.19;

    const basesHz = [41.2, 61.88, 92.5, 116.54];
    const oscs: OscillatorNode[] = [];
    basesHz.forEach((hz, i) => {
      const o = ctx.createOscillator();
      o.type = i === 0 ? 'sine' : 'triangle';
      o.frequency.value = hz;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.42 : 0.07 + i * 0.025;
      o.connect(g);
      g.connect(master);
      o.start(0);
      oscs.push(o);
    });

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = 0.031;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.014;
    lfo.connect(lfoGain);
    lfoGain.connect(master.gain);
    lfo.start(0);
    oscs.push(lfo);

    const bufLen = ctx.sampleRate * 6;
    const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufLen; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.035;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const ng = ctx.createGain();
    ng.gain.value = 0.045;
    noise.connect(ng);
    ng.connect(master);
    noise.start(0);

    master.connect(ctx.destination);

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

    setOn(true);
    return ctx;
  }, [stop]);

  useEffect(() => {
    if (/^\/u0[1-4]$/i.test(pathname ?? '')) {
      stop();
      return;
    }

    stop();
    const ctx = start();
    if (!ctx) return;

    const unlock = () => {
      void ctx.resume();
    };
    if (ctx.state === 'suspended') {
      window.addEventListener('pointerdown', unlock, { once: true, passive: true });
      window.addEventListener('keydown', unlock, { once: true });
    }

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      stop();
    };
  }, [pathname, start, stop]);

  if (/^\/u0[1-4]$/i.test(pathname ?? '')) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed bottom-6 left-6 z-[80] max-w-[calc(100vw-3rem)]">
      {!on ? (
        <button
          type="button"
          onClick={start}
          className="pointer-events-auto touch-manipulation border border-white/[0.08] bg-black/90 px-3 py-2 font-mono text-[9px] tracking-[0.24em] text-[#4f555d] transition-colors duration-[1.2s] hover:border-white/[0.14] hover:text-[#808890]"
        >
          {t('siteAmbient.idle')}
        </button>
      ) : (
        <button
          type="button"
          onClick={stop}
          className="pointer-events-auto touch-manipulation border border-white/[0.08] bg-black/90 px-3 py-2 font-mono text-[9px] tracking-[0.24em] text-[#4f555d] transition-colors duration-[1.2s] hover:border-white/[0.14] hover:text-[#808890]"
        >
          {t('siteAmbient.mute')}
        </button>
      )}
    </div>
  );
}
