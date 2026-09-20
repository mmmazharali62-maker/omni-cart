import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";

// Customer management (spec section 14/32).
export default async function AdminCustomersPage() {
  const customers = await db.user
    .findMany({
      where: { role: "CUSTOMER" },
      orderBy: { createdAt: "desc" },
      take: 100,
      include: {
        _count: { select: { orders: true, reviews: true, wishlist: true } },
        orders: { select: { grandTotal: true, status: true } }
      }
    })
    .catch(() => []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Customers</h1>
      <GlassPanel>
        {customers.length === 0 ? (
          <p className="text-white/50 text-sm py-4">No customers yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr><th className="text-left py-2">Name</th><th className="text-left">Email</th><th className="text-left">Orders</th><th className="text-left">Lifetime Value</th><th className="text-left">Wishlist</th><th className="text-left">Joined</th></tr>
            </thead>
            <tbody>
              {customers.map((c) => {
                const ltv = c.orders
                  .filter((o) => !["PENDING", "FAILED", "CANCELLED"].includes(o.status))
                  .reduce((s, o) => s + o.grandTotal.toNumber(), 0);
                return (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="py-3">{c.name ?? "—"}</td>
                    <td className="text-white/70">{c.email}</td>
                    <td>{c._count.orders}</td>
                    <td>{formatMoney(ltv)}</td>
                    <td className="text-white/70">{c._count.wishlist}</td>
                    <td className="text-white/50">{c.createdAt.toDateString()}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </GlassPanel>
    </section>
  );
}
