'use client';

type Props = {
  personalPct: number;
  globalPct: number;
  personalLabel: string;
  globalLabel: string;
  personalDetail: string;
  globalDetail: string;
  syncedHint?: string;
};

function clampPct(n: number): number {
  if (!Number.isFinite(n)) return 0;
  return Math.min(100, Math.max(0, n));
}

export function MintProgressBars({
  personalPct,
  globalPct,
  personalLabel,
  globalLabel,
  personalDetail,
  globalDetail,
  syncedHint,
}: Props) {
  const p = clampPct(personalPct);
  const g = clampPct(globalPct);

  return (
    <div className="mt-5 space-y-4 rounded border border-white/[0.06] bg-black/40 p-4 shadow-[inset_0_1px_0_rgba(255,255,255,0.04)]">
      {syncedHint ? (
        <p className="font-mono text-[8px] tracking-[0.18em] text-[#5c656e]">{syncedHint}</p>
      ) : null}

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[9px] tracking-[0.14em] text-[#8e959e]">
          <span>{personalLabel}</span>
          <span className="tabular-nums text-[#b8c0c9]">{personalDetail}</span>
        </div>
        <div
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/[0.05]"
          role="progressbar"
          aria-valuenow={Math.round(p)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={personalLabel}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-600/90 via-emerald-400/85 to-teal-300/70 shadow-[0_0_12px_rgba(52,211,153,0.35)] transition-[width] duration-500 ease-out"
            style={{ width: `${p}%` }}
          />
        </div>
      </div>

      <div>
        <div className="flex flex-wrap items-baseline justify-between gap-2 font-mono text-[9px] tracking-[0.14em] text-[#8e959e]">
          <span>{globalLabel}</span>
          <span className="tabular-nums text-[#b8c0c9]">{globalDetail}</span>
        </div>
        <div
          className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white/[0.06] ring-1 ring-white/[0.05]"
          role="progressbar"
          aria-valuenow={Math.round(g)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={globalLabel}
        >
          <div
            className="h-full rounded-full bg-gradient-to-r from-sky-700/90 via-cyan-500/80 to-slate-300/65 shadow-[0_0_12px_rgba(34,211,238,0.28)] transition-[width] duration-500 ease-out"
            style={{ width: `${g}%` }}
          />
        </div>
      </div>
    </div>
  );
}
