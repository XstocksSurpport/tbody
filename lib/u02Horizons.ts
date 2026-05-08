/** Revision cadence options — labels via `t(\`u02.horizon.${id}\`)`. */
export const U02_HORIZON_ORDER = [
  'h1',
  'h6',
  'h12',
  'd1',
  'd3',
  'd5',
  'd7',
  'd15',
  'd30',
  'd45',
  'd60',
  'd90',
  'd120',
  'd180',
  'd270',
  'd360',
] as const;

export type U02HorizonId = (typeof U02_HORIZON_ORDER)[number];

const H = 3600000;
const D = 86400000;

export const U02_HORIZON_MS: Record<U02HorizonId, number> = {
  h1: H,
  h6: 6 * H,
  h12: 12 * H,
  d1: D,
  d3: 3 * D,
  d5: 5 * D,
  d7: 7 * D,
  d15: 15 * D,
  d30: 30 * D,
  d45: 45 * D,
  d60: 60 * D,
  d90: 90 * D,
  d120: 120 * D,
  d180: 180 * D,
  d270: 270 * D,
  d360: 360 * D,
};
