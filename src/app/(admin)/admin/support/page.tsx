import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import Link from "next/link";

// Support tickets (spec section 29): return requests + customer issues.
export default async function AdminSupportPage() {
  const tickets = await db.supportTicket
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 100,

    })
    .catch(() => []);

  const open = tickets.filter((t) => t.status === "open");

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-2">Support</h1>
      <p className="text-white/50 text-sm mb-6">{open.length} open ticket{open.length === 1 ? "" : "s"} (return requests + issues).</p>

      <GlassPanel>
        {tickets.length === 0 ? (
          <p className="text-white/50 text-sm py-4">No tickets yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr><th className="text-left py-2">Ticket</th><th className="text-left">From</th><th className="text-left">Order</th><th className="text-left">Status</th><th className="text-left">Received</th></tr>
            </thead>
            <tbody>
              {tickets.map((t) => (
                <tr key={t.id} className="border-t border-white/10">
                  <td className="py-3 max-w-[280px]">
                    <p className="truncate">{t.subject}</p>
                    <p className="text-xs text-white/40 truncate">{t.body}</p>
                  </td>
                  <td className="text-white/70">{t.userId ? "registered" : "guest"}</td>
                  <td className="font-mono text-xs">
                    {t.orderId ? <Link href="/admin/orders" className="text-brand-400">{t.orderId.slice(0, 8)}</Link> : "—"}
                  </td>
                  <td>
                    <span className={`px-2 py-1 rounded-full text-xs ${t.status === "open" ? "bg-amber-500/20 text-amber-300" : "bg-white/10 text-white/50"}`}>
                      {t.status}
                    </span>
                  </td>
                  <td className="text-white/50">{t.createdAt.toDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>
      <p className="text-xs text-white/40 mt-4">
        Ticket resolution actions (reply, approve return, trigger refund) are next; refunds via the order page already work.
      </p>
    </section>
  );
}
