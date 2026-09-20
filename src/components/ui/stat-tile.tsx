// KPI tile for dashboards (spec section 14).
export function StatTile({ label, value, delta, invert }: { label: string; value: string | number; delta?: number; invert?: boolean }) {
  const positive = invert ? (delta ?? 0) < 0 : (delta ?? 0) > 0;
  const neutral = delta === undefined || delta === 0;
  return (
    <div className="glass p-5">
      <p className="text-xs text-white/50 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-semibold mt-2">{value}</p>
      {delta !== undefined && (
        <p className={`text-xs mt-1 ${neutral ? "text-white/40" : positive ? "text-emerald-400" : "text-red-400"}`}>
          {delta > 0 ? "+" : ""}{delta}% vs last period
        </p>
      )}
    </div>
  );
}
