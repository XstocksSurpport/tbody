export type UniverseId = 'u01' | 'u02' | 'u03' | 'u04';

export type UniverseMeta = {
  id: UniverseId;
  index: number;
  label: string;
  designation: string;
  temperament: string;
  mechanism: string;
  tokenNote: string;
};

/** Four parallel world-lines inspired by the Three-Body novel cycle — eras, not literal canon. */
export const UNIVERSES: UniverseMeta[] = [
  {
    id: 'u01',
    index: 0,
    label: 'ERA I',
    designation: 'Stable era',
    temperament:
      'When suns agree long enough, calendars become trustworthy again; civilization can hydrate on the surface.',
    mechanism: 'Fixed epoch price · 1000 nominal units / pulse',
    tokenNote: 'nominal mint weight: 1000 per transaction',
  },
  {
    id: 'u02',
    index: 1,
    label: 'ERA II',
    designation: 'Chaotic era',
    temperament:
      'Three bodies tug at the sky — flare or freeze on short notice; survival favors those who can lie dormant.',
    mechanism: 'Bounded stochastic fee schedule',
    tokenNote: 'nominal weight: stochastic per pulse',
  },
  {
    id: 'u03',
    index: 2,
    label: 'ERA III',
    designation: 'Sophon veil',
    temperament:
      'Macroscopic mirrors pretend to be elementary — lock enough collisions and every accelerator reads like sabotage.',
    mechanism: 'Decreasing fee staircase',
    tokenNote: 'nominal weight: decay schedule',
  },
  {
    id: 'u04',
    index: 3,
    label: 'ERA IV',
    designation: 'Dark forest',
    temperament:
      'Broadcast once and every listener marks your throat — silence across light-years is the oldest treaty.',
    mechanism: 'Rising fee with hard ceiling',
    tokenNote: 'nominal weight: entropy ascent',
  },
];

export function getUniverse(id: string): UniverseMeta | undefined {
  return UNIVERSES.find((u) => u.id === id);
}
