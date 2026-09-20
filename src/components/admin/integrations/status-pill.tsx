// Readiness pill: green (ready), amber (partial), gray (not started).
export function StatusPill({ ready, active }: { ready: boolean; active: boolean }) {
  if (ready && active) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-emerald-500/20 text-emerald-300">Ready</span>;
  }
  if (ready) {
    return <span className="px-2 py-0.5 rounded-full text-xs bg-amber-500/20 text-amber-300">Saved - inactive</span>;
  }
  return <span className="px-2 py-0.5 rounded-full text-xs bg-white/10 text-white/50">Not configured</span>;
}
