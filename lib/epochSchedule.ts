/**
 * Site-wide epoch schedule (下一纪元): fixed anchor in Beijing time, real wall-clock countdown.
 * Anchor: 北京时间 2026-05-08 06:00 — subsequent boundaries every 7 days at the same local time (+08:00).
 *
 * Use explicit UTC ms (not `Date.parse` strings): WebKit/Safari has historically mishandled some
 * ISO-8601 + offset forms, which produced NaN / wrong instants and collapsed the countdown to ~0d on mobile.
 */
/** Beijing 2026-05-08 06:00 (+08) → UTC 2026-05-07 22:00 */
export const EPOCH_ANCHOR_MS = Date.UTC(2026, 4, 7, 22, 0, 0);

/** One full cycle between epoch boundaries (matches historical “next epoch in 7 days”). */
export const EPOCH_PERIOD_MS = 7 * 86400000;

/** Next strictly future boundary after `nowMs` (first activation at anchor if still before it). */
export function getNextEpochBoundaryMs(nowMs: number): number {
  const now = Number.isFinite(nowMs) ? nowMs : Date.now();
  if (!Number.isFinite(EPOCH_ANCHOR_MS)) {
    return now + EPOCH_PERIOD_MS;
  }
  if (now < EPOCH_ANCHOR_MS) return EPOCH_ANCHOR_MS;
  const elapsed = now - EPOCH_ANCHOR_MS;
  const k = Math.floor(elapsed / EPOCH_PERIOD_MS);
  const next = EPOCH_ANCHOR_MS + (k + 1) * EPOCH_PERIOD_MS;
  return Number.isFinite(next) ? next : EPOCH_ANCHOR_MS + EPOCH_PERIOD_MS;
}

/** Milliseconds remaining until the next epoch boundary. */
export function getMsUntilNextEpoch(nowMs: number): number {
  const now = Number.isFinite(nowMs) ? nowMs : Date.now();
  const next = getNextEpochBoundaryMs(now);
  const diff = next - now;
  if (!Number.isFinite(diff)) return 0;
  return Math.max(0, diff);
}

/**
 * Which 7-day segment we are in after the anchor. -1 = before the first boundary has “started” the timeline.
 * Segment 0 = [ANCHOR, ANCHOR + PERIOD), etc.
 */
export function getEpochSegmentIndex(nowMs: number): number {
  if (nowMs < EPOCH_ANCHOR_MS) return -1;
  return Math.floor((nowMs - EPOCH_ANCHOR_MS) / EPOCH_PERIOD_MS);
}

export function pad2(n: number): string {
  return String(n).padStart(2, '0');
}

export function splitMsIntoDHMS(ms: number): { days: number; h: number; m: number; s: number } {
  const safeMs = Number.isFinite(ms) ? ms : 0;
  const totalSec = Math.floor(Math.max(0, safeMs) / 1000);
  const days = Math.floor(totalSec / 86400);
  const h = Math.floor((totalSec % 86400) / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return { days, h, m, s };
}
