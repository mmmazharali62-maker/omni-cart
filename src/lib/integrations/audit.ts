import { db } from "@/lib/db";

// Audit trail for credential changes (spec section 17: every admin action logged).
// Values are never logged - only which provider/fields changed.
export async function logIntegrationChange(
  action: "INTEGRATION_KEYS_SAVED" | "INTEGRATION_KEYS_CLEARED" | "INTEGRATION_TESTED",
  provider: string,
  userId: string,
  meta?: Record<string, unknown>
) {
  await db.auditLog
    .create({
      data: {
        userId,
        action,
        meta: { provider, at: new Date().toISOString(), ...meta }
      }
    })
    .catch(() => null); // audit must never block the operation
}
