import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_COPY, type ReturnStatus } from "@/lib/returns/status";
import { reasonLabel } from "@/lib/returns/reasons";

export type ReturnRow = {
  id: string;
  orderId: string;
  reason: string;
  status: string;
  refundAmount?: number | null;
  createdAt: string | Date;
};

// Customer's return requests (spec section 29).
export function ReturnsList({ returns }: { returns: ReturnRow[] }) {
  if (returns.length === 0) {
    return <EmptyState title="No returns yet" message="Your return requests will appear here." />;
  }
  return (
    <ul className="space-y-3">
      {returns.map((r) => {
        const copy = STATUS_COPY[(r.status as ReturnStatus)] ?? { label: r.status, blurb: "" };
        const variant = r.status === "refunded" ? "success" : r.status === "rejected" || r.status === "cancelled" ? "danger" : "neutral";
        return (
          <li key={r.id}>
            <Link href={`/returns/${r.id}`} className="glass p-4 block hover:bg-white/5">
              <div className="flex items-center justify-between gap-2">
                <span className="font-medium text-sm">Return {r.id.slice(0, 8)}</span>
                <Badge variant={variant as "success" | "danger" | "neutral"}>{copy.label}</Badge>
              </div>
              <p className="text-xs text-white/50 mt-1">
                Order {r.orderId.slice(0, 8)} - {reasonLabel(r.reason)}
              </p>
              {r.refundAmount != null && (
                <p className="text-xs text-emerald-400 mt-1">Refund: ${Number(r.refundAmount).toFixed(2)}</p>
              )}
              <p className="text-xs text-white/40 mt-1">{copy.blurb}</p>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
