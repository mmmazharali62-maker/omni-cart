import { db } from "@/lib/db";
import { DataTable, type Column } from "@/components/ui/data-table";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { reasonLabel } from "@/lib/returns/reasons";

export const metadata = { title: "Returns | Omni Cart" };

type ReturnRow = {
  id: string; orderId: string; email: string; reason: string; status: string;
  refundAmount: string | null; createdAt: Date;
};

// Admin returns queue (spec section 14/29).
export default async function AdminReturnsPage() {
  const returns = await db.returnRequest.findMany({
    orderBy: { createdAt: "desc" },
    take: 100
  }).catch(() => []);

  const columns: Column<ReturnRow>[] = [
    { header: "Requested", cell: (r) => r.createdAt.toLocaleDateString() },
    { header: "Order", cell: (r) => <code className="font-mono text-xs">{r.orderId.slice(0, 8)}</code> },
    { header: "Customer", cell: (r) => <span className="text-white/60">{r.email}</span> },
    { header: "Reason", cell: (r) => reasonLabel(r.reason) },
    {
      header: "Status",
      cell: (r) => {
        const variant = r.status === "refunded" ? "success" : r.status === "rejected" || r.status === "cancelled" ? "danger" : "neutral";
        return <Badge variant={variant as never}>{r.status}</Badge>;
      }
    },
    { header: "Refund", cell: (r) => (r.refundAmount ? `$${Number(r.refundAmount).toFixed(2)}` : "-") }
  ];

  return (
    <section className="mx-4 mt-12 max-w-6xl">
      <h1 className="text-3xl font-semibold">Returns</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Approve, receive, refund - via the state machine.</p>
      <div className="glass p-5">
        <DataTable
          rows={returns as unknown as ReturnRow[]}
          columns={columns}
          emptyMessage="No return requests yet."
        />
      </div>
      {returns.length === 0 && <div className="mt-4"><EmptyState title="All quiet" message="Return requests appear here as customers submit them." /></div>}
    </section>
  );
}
