import type { ObservationPanelId } from '@/lib/universeCopy';

/** Distinct procedural beds — same engine, different physics per corridor. */
export type UniverseAudioPreset = {
  /** Hz — primary drone */
  base: number;
  /** Minor ratio tweak vs harmonic companion */
  ratio: number;
  /** Slow amplitude drift rate */
  lfoHz: number;
  /** FM-ish depth on master gain */
  lfoDepth: number;
  /** Grain layer */
  noise: number;
  master: number;
  /** Optional upper partial multiplier for beating (“fission”) */
  partialMul?: number;
  partialGain?: number;
};

export const UNIVERSE_AUDIO: Record<ObservationPanelId, UniverseAudioPreset> = {
  u01: {
    base: 40,
    ratio: 1.50015,
    lfoHz: 0.032,
    lfoDepth: 0.005,
    noise: 0.005,
    master: 0.013,
  },
  u02: {
    base: 54,
    ratio: 1.504,
    lfoHz: 0.42,
    lfoDepth: 0.022,
    noise: 0.03,
    master: 0.021,
  },
  u03: {
    base: 47,
    ratio: 1.5012,
    lfoHz: 0.11,
    lfoDepth: 0.016,
    noise: 0.016,
    master: 0.017,
    partialMul: 2.008,
    partialGain: 0.004,
  },
  u04: {
    base: 31,
    ratio: 1.50005,
    lfoHz: 0.015,
    lfoDepth: 0.0028,
    noise: 0.0025,
    master: 0.0095,
  },
};

export const UNIVERSE_AUDIO_LABEL: Record<ObservationPanelId, string> = {
  u01: '[ STABLE BED ]',
  u02: '[ ENTROPY FIELD ]',
  u03: '[ COGNITIVE CARRIER ]',
  u04: '[ DEEP BAND ]',
};
