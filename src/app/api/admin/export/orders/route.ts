import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { toCsv, csvResponse } from "@/lib/export/csv";

// Orders CSV export (spec section 14).
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(["ADMIN", "STORE_MANAGER", "OPERATIONS"]);
  if (!guard.ok) return new Response("Forbidden", { status: guard.status });

  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5000,
    include: { _count: { select: { items: true } } }
  });

  const csv = toCsv(orders, [
    { header: "order_id", value: (o: typeof orders[number]) => o.id.slice(0, 12) },
    { header: "date", value: (o: typeof orders[number]) => o.createdAt.toISOString() },
    { header: "status", value: (o: typeof orders[number]) => o.status },
    { header: "items", value: (o: typeof orders[number]) => o._count.items },
    { header: "subtotal", value: (o: typeof orders[number]) => Number(o.subtotal) },
    { header: "discount", value: (o: typeof orders[number]) => Number(o.discountTotal) },
    { header: "shipping", value: (o: typeof orders[number]) => Number(o.shippingTotal) },
    { header: "tax", value: (o: typeof orders[number]) => Number(o.taxTotal) },
    { header: "total", value: (o: typeof orders[number]) => Number(o.grandTotal) },
    { header: "currency", value: (o: typeof orders[number]) => o.currency }
  ]);

  return csvResponse(`orders-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
