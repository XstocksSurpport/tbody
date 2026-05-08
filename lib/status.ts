import type { UniverseId } from './universes';

/** Corridor-era status labels derived from ignition progress (presentation). */
export function universeStatusLine(id: UniverseId, raisedPct: number): string {
  if (raisedPct >= 100) return 'SEALED';

  switch (id) {
    case 'u01':
      if (raisedPct > 85) return 'SOLID ERA';
      if (raisedPct > 55) return 'STEADY SUN';
      return 'CALENDAR HOLDS';
    case 'u02':
      if (raisedPct > 75) return 'CHAOS SATURATED';
      if (raisedPct > 35) return 'THREE SUNS SWAY';
      return 'FLARE LATENT';
    case 'u03':
      if (raisedPct > 70) return 'VEIL CLOSED';
      if (raisedPct > 40) return 'LOCK DEEPENS';
      return 'PROTON UNFOLDING';
    case 'u04':
      if (raisedPct > 65) return 'EXPOSURE RISK';
      if (raisedPct > 30) return 'FOREST NOISE ↑';
      return 'SILENCE ARMORED';
    default:
      return 'UNKNOWN';
  }
}
