import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";

// Audit trail (spec section 32): every admin mutation, retry, and transition.
export default async function AdminAuditPage() {
  const logs = await db.auditLog
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 100,
      include: { user: { select: { email: true } } }
    })
    .catch(() => []);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-2">Audit Log</h1>
      <p className="text-white/50 text-sm mb-6">Every admin action, order transition, and retry is recorded here.</p>
      <GlassPanel>
        {logs.length === 0 ? (
          <p className="text-white/50 text-sm py-4">No audit events yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr><th className="text-left py-2">Action</th><th className="text-left">Actor</th><th className="text-left">Order</th><th className="text-left">When</th></tr>
            </thead>
            <tbody>
              {logs.map((l) => (
                <tr key={l.id} className="border-t border-white/10">
                  <td className="py-2 font-mono text-xs">{l.action}</td>
                  <td className="text-white/70">{l.user?.email ?? "system"}</td>
                  <td className="text-white/60 font-mono text-xs">{l.orderId?.slice(0, 8) ?? "—"}</td>
                  <td className="text-white/50">{l.createdAt.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </GlassPanel>
    </section>
  );
}
