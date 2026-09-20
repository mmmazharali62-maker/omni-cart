import { GlassPanel } from "@/components/ui/glass-panel";
import { healthVerdict } from "@/lib/suppliers/health";

export type SupplierHealthRow = {
  id: string; name: string; score: number;
  onTimeRate: number; fulfillmentRate: number; defectRate: number; avgShipDays: number;
};

// Supplier health board (spec section 11/14/26).
export function SupplierHealthBoard({ rows }: { rows: SupplierHealthRow[] }) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/50">No supplier stats yet - they appear after the first syncs.</p>;
  }
  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {rows.map((r) => {
        const verdict = healthVerdict(r.score);
        const color = verdict === "healthy" ? "text-emerald-400" : verdict === "watch" ? "text-amber-400" : "text-red-400";
        return (
          <GlassPanel key={r.id} className="p-5">
            <div className="flex items-center justify-between">
              <p className="font-medium">{r.name}</p>
              <span className={`text-2xl font-semibold ${color}`}>{r.score}</span>
            </div>
            <div className="w-full h-1.5 rounded-full bg-white/10 mt-3 overflow-hidden">
              <div className={`h-full ${verdict === "healthy" ? "bg-emerald-400" : verdict === "watch" ? "bg-amber-400" : "bg-red-400"}`} style={{ width: `${r.score}%` }} />
            </div>
            <dl className="grid grid-cols-2 gap-2 text-xs text-white/50 mt-4">
              <div><dt>On-time</dt><dd className="text-white/80">{Math.round(r.onTimeRate * 100)}%</dd></div>
              <div><dt>Fulfillment</dt><dd className="text-white/80">{Math.round(r.fulfillmentRate * 100)}%</dd></div>
              <div><dt>Defects</dt><dd className="text-white/80">{Math.round(r.defectRate * 100)}%</dd></div>
              <div><dt>Avg ship</dt><dd className="text-white/80">{r.avgShipDays}d</dd></div>
            </dl>
          </GlassPanel>
        );
      })}
    </div>
  );
}
