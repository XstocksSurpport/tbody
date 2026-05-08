'use client';

import { useCallback, useEffect, useRef } from 'react';
import type { ObservationPanelId } from '@/lib/universeCopy';
import { UNIVERSE_AUDIO } from '@/lib/universeAudioPresets';

type Props = { preset: ObservationPanelId };

/** Corridor procedural bed (no UI): first pointer/key starts playback. */
export function AmbientAudio({ preset }: Props) {
  const ctxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);

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
  }, []);

  const start = useCallback(() => {
    stop();
    const AC =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    const ctx = new AC();
    ctxRef.current = ctx;
    void ctx.resume();

    const p = UNIVERSE_AUDIO[preset];
    const gain = ctx.createGain();
    gain.gain.value = p.master;

    const o1 = ctx.createOscillator();
    o1.type = 'sine';
    o1.frequency.value = p.base;
    const o2 = ctx.createOscillator();
    o2.type = 'sine';
    o2.frequency.value = p.base * p.ratio;

    const lfo = ctx.createOscillator();
    lfo.type = 'sine';
    lfo.frequency.value = p.lfoHz;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = p.lfoDepth;
    lfo.connect(lfoGain);
    lfoGain.connect(gain.gain);

    o1.connect(gain);
    o2.connect(gain);

    const oscs: OscillatorNode[] = [o1, o2, lfo];

    if (p.partialMul && p.partialGain) {
      const o3 = ctx.createOscillator();
      o3.type = 'sine';
      o3.frequency.value = p.base * p.partialMul;
      const pg = ctx.createGain();
      pg.gain.value = p.partialGain;
      o3.connect(pg);
      pg.connect(gain);
      oscs.push(o3);
    }

    gain.connect(ctx.destination);

    const bufferSize = ctx.sampleRate * (preset === 'u04' ? 6 : 3);
    const buf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      d[i] = (Math.random() * 2 - 1) * (preset === 'u02' ? 0.09 : 0.055);
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buf;
    noise.loop = true;
    const ng = ctx.createGain();
    ng.gain.value = p.noise;
    noise.connect(ng);
    ng.connect(ctx.destination);
    noise.start(0);
    noiseRef.current = noise;

    oscillatorsRef.current = oscs;
    oscs.forEach((o) => o.start(0));
    return ctx;
  }, [preset, stop]);

  useEffect(() => {
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
  }, [preset, start, stop]);

  return null;
}
