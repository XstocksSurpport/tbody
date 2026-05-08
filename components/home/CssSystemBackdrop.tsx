'use client';

import './css-backdrop.css';

/**
 * Pure-CSS void / starfield feel — no WebGL, no appendChild/removeChild races with React 18 Strict Mode.
 * (Three.js canvas under React was a frequent source of “removeChild: not a child of this node”.)
 */
export function CssSystemBackdrop() {
  return (
    <div className="css-backdrop pointer-events-none fixed inset-0 z-0 h-[100dvh] min-h-[100vh] w-full" aria-hidden>
      <div className="css-backdrop-grid" aria-hidden />
      <div className="css-backdrop-flow" aria-hidden />
      <div className="css-backdrop-stars" aria-hidden />
    </div>
  );
}
