import { db } from "@/lib/db";

// Maintenance job (spec section 14): prune stale data so tables stay lean.
// Runs on a schedule; safe to run repeatedly (idempotent deletes).
export async function runCleanup(days = 30) {
  const cutoff = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const [webhooks, audit] = await Promise.all([
    db.webhookEvent.deleteMany({ where: { createdAt: { lt: cutoff } } }).catch(() => null),
    db.auditLog.deleteMany({ where: { createdAt: { lt: cutoff }, action: { not: "ROLE_CHANGE" } } }).catch(() => null)
  ]);

  return {
    webhooksPruned: webhooks?.count ?? 0,
    auditPruned: audit?.count ?? 0
  };
}
