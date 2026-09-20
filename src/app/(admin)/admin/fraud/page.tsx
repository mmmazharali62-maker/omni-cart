import { db } from "@/lib/db";
import { FraudQueue } from "@/components/admin/ops/fraud-queue";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = { title: "Fraud Review | Omni Cart" };

// Fraud review queue (spec section 17/26): scores from src/lib/fraud/checks.ts.
export default async function AdminFraudPage() {
  const flags = await db.fraudFlag.findMany({
    where: { status: "open" },
    orderBy: { score: "desc" },
    take: 50
  }).catch(() => []);

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">Fraud review</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Holds auto-clear when resolved; nothing blocks honest customers.</p>
      {flags.length === 0 ? (
        <EmptyState title="No open flags" message="Flagged orders appear here for review before fulfillment." />
      ) : (
        <FraudQueue rows={flags.map((f) => ({
          id: f.id, orderId: f.orderId, score: f.score, action: f.action, status: f.status,
          flags: Array.isArray(f.flags) ? (f.flags as string[]) : [], createdAt: f.createdAt.toISOString()
        }))} />
      )}
    </section>
  );
}
