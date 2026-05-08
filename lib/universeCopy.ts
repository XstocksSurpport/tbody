/**
 * On-screen copy — terminology fixed by specification only.
 * Do not introduce alternate labels here.
 */
export const HOME_COPY = {
  title: '3BODY',
  subtitle: '4 PARALLEL CIVILIZATIONS DETECTED',
  migrationLine1: 'RESIST CIVILIZATION INTRUSION',
  migrationLine2: 'NOT YET INITIALIZED',
} as const;

export type ObservationPanelId = 'u01' | 'u02' | 'u03' | 'u04';

export type ObservationPanelCopy = {
  id: ObservationPanelId;
  code: string;
  era: string;
  panelLine: string;
  statusLine: string;
};

/** In-route status line (may differ from observation-panel headline). */
export const ERA_ROUTE = {
  u01: {
    code: 'U-01',
    era: 'STABLE ERA',
    universeStatus: 'CIVILIZATION IS STABLE',
    /** Mechanism axis — aligns corridor economics with UI tone */
    mechanism: 'LOW VOLATILITY · STABILIZED FEEDBACK',
  },
  u02: {
    code: 'U-02',
    era: 'CHAOTIC ERA',
    universeStatus: 'ERA SHIFT DETECTED',
    mechanism: 'HIGH VOLATILITY · ENTROPY COUPLED PARAMETERS',
  },
  u03: {
    code: 'U-03',
    era: 'SOPHON ERA',
    universeStatus: 'ONE MARKET · EXECUTION VARIES',
    mechanism: 'ASYMMETRIC SURFACE · HIGH VARIANCE OUTCOMES',
  },
  u04: {
    code: 'U-04',
    era: 'DARK FOREST',
    universeStatus: 'DO NOT EXPOSE YOURSELF',
    mechanism: 'MINIMAL DISCLOSURE · LIQUIDITY STARVED',
  },
} as const;

export type EraRouteKey = keyof typeof ERA_ROUTE;

export const OBSERVATION_PANELS: readonly ObservationPanelCopy[] = [
  {
    id: 'u01',
    code: 'U-01',
    era: 'STABLE ERA',
    panelLine: 'CIVILIZATION IS STABLE',
    statusLine: 'STATUS: ACTIVE',
  },
  {
    id: 'u02',
    code: 'U-02',
    era: 'CHAOTIC ERA',
    panelLine: 'RULES ARE CHANGING',
    statusLine: 'STATUS: UNSTABLE',
  },
  {
    id: 'u03',
    code: 'U-03',
    era: 'SOPHON ERA',
    panelLine: 'COGNITIVE MARKET LAYER',
    statusLine: 'STATUS: STRATIFIED',
  },
  {
    id: 'u04',
    code: 'U-04',
    era: 'DARK FOREST',
    panelLine: 'DO NOT EXPOSE YOURSELF',
    statusLine: 'STATUS: SILENT',
  },
] as const;
