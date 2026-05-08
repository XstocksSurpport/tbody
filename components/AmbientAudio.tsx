'use client';

import { useCallback, useRef, useState } from 'react';
import type { ObservationPanelId } from '@/lib/universeCopy';
import { UNIVERSE_AUDIO } from '@/lib/universeAudioPresets';
import { useI18n } from '@/lib/i18n-context';

type Props = { preset: ObservationPanelId };

/** Corridor-specific procedural bed — starts only after explicit gesture (browser audio policy). */
export function AmbientAudio({ preset }: Props) {
  const { t } = useI18n();
  const ctxRef = useRef<AudioContext | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const noiseRef = useRef<AudioBufferSourceNode | null>(null);
  const [on, setOn] = useState(false);

  const btnIdle = t(`audio.${preset}`);

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
    setOn(true);
  }, [preset, stop]);

  return (
    <div className="universe-ambient audio-strip">
      {!on ? (
        <button type="button" className="ctrl ctrl-quiet universe-ambient-btn" onClick={start}>
          {btnIdle}
        </button>
      ) : (
        <button type="button" className="ctrl ctrl-quiet universe-ambient-btn" onClick={stop}>
          {t('audioMuteCorridor')}
        </button>
      )}
    </div>
  );
}
