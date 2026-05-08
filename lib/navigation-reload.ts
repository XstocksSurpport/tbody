/**
 * True when the user explicitly reloaded the tab (F5 / refresh / address-bar reload).
 * Not true for link navigations (including HardNavLink full loads) — those are `navigate`.
 */
export function isReloadNavigation(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const nav = performance.getEntriesByType('navigation')[0] as
      | PerformanceNavigationTiming
      | undefined;
    if (nav?.type === 'reload') return true;
  } catch {
    /* */
  }
  try {
    const legacy = (performance as unknown as { navigation?: { type: number } }).navigation;
    // Legacy Navigation Timing 1: TYPE_RELOAD = 1, TYPE_BACK_FORWARD = 2
    if (legacy?.type === 1) return true;
  } catch {
    /* */
  }
  return false;
}
