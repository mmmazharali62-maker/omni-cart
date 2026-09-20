import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { STATUS_COPY, type ReturnStatus } from "@/lib/returns/status";
import { reasonLabel } from "@/lib/returns/reasons";
import { Badge } from "@/components/ui/badge";

export default async function ReturnDetailPage({ params }: { params: { id: string } }) {
  const request = await db.returnRequest.findUnique({ where: { id: params.id } }).catch(() => null);
  if (!request) notFound();

  // Guests can open via the emailed link; signed-in owners see their own.
  const session = await getServerSession(authOptions).catch(() => null);
  const user = session?.user as { id?: string } | undefined;
  if (request.userId && user?.id && request.userId !== user.id) notFound();

  const copy = STATUS_COPY[(request.status as ReturnStatus)] ?? { label: request.status, blurb: "" };
  const items = (request.items as Array<{ title: string; quantity: number; price: number }>) ?? [];

  return (
    <section className="mx-4 mt-12 max-w-2xl">
      <h1 className="text-2xl font-semibold">Return {request.id.slice(0, 8)}</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Order {request.orderId.slice(0, 8)} - {reasonLabel(request.reason)}</p>

      <div className="glass p-5 space-y-4">
        <div className="flex items-center justify-between">
          <p className="text-lg font-medium">{copy.label}</p>
          <Badge variant={request.status === "refunded" ? "success" : request.status === "rejected" ? "danger" : "neutral"}>
            {copy.label}
          </Badge>
        </div>
        <p className="text-sm text-white/60">{copy.blurb}</p>

        <div className="pt-4 border-t border-white/10">
          <p className="text-sm font-medium mb-2">Items</p>
          <ul className="text-sm text-white/70 space-y-1">
            {items.map((i, idx) => (
              <li key={idx}>{i.quantity}x {i.title} - ${i.price.toFixed(2)}</li>
            ))}
          </ul>
        </div>

        {request.refundAmount != null && (
          <div className="pt-4 border-t border-white/10">
            <p className="text-sm">Refund: <span className="text-emerald-400 font-medium">${Number(request.refundAmount).toFixed(2)}</span></p>
          </div>
        )}
        {request.note && (
          <p className="text-xs text-white/50 border-t border-white/10 pt-4">Note: {request.note}</p>
        )}
      </div>
    </section>
  );
}
