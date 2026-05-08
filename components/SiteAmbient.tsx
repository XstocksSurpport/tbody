'use client';

import { usePathname } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useI18n } from '@/lib/i18n-context';

/** Site-wide low-frequency bed — requires explicit enable (browser audio policy). */
export function SiteAmbient() {
  const pathname = usePathname();
  const { t } = useI18n();
  const ctxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const [on, setOn] = useState(false);

  const stop = useCallback(() => {
    oscillatorsRef.current.forEach((o) => {
      try {
        o.stop();
      } catch {
        /* already stopped */
      }
    });
    oscillatorsRef.current = [];
    try {
      noiseRef.current?.stop();
    } catch {
      /* */
    }
    noiseRef.current = null;
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

    const base = 38;
    const gain = ctx.createGain();
    gain.gain.value = 0.014;

    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = base;
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = base * 1.5003;

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.008;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    o1.connect(gain);
    o2.connect(gain);
    gain.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * 4;
    const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      d[i] = (Math.random() * 2 - 1) * 0.05;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const ng = ctx.createGain();
    ng.gain.value = 0.008;
    noise.connect(ng);
    ng.connect(ctx.destination);
    noise.start(0);
    noiseRef.current = noise;

    oscillatorsRef.current = [o1, o2, lfo];
    [o1, o2, lfo].forEach((o) => o.start(0));
    setOn(true);
  }, [stop]);

  useEffect(() => {
    if (/^\/u0[1-4]$/i.test(pathname ?? '')) {
      stop();
    }
  }, [pathname, stop]);

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
