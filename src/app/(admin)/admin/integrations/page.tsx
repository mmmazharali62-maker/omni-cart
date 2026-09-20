import { db } from "@/lib/db";
import { PROVIDERS } from "@/lib/integrations/catalog";
import { computeAllStatuses, overallReadiness } from "@/lib/integrations/status";
import { IntegrationsGrid } from "@/components/admin/integrations/integrations-grid";
import { IntegrationsClient } from "@/components/admin/integrations/integrations-client";
import { SetupChecklist } from "@/components/admin/integrations/setup-checklist";
import { DbStatusCard } from "@/components/admin/integrations/db-status-card";

export const metadata = { title: "Integrations | Omni Cart" };

// Integrations hub (spec section 17/19): every credential configurable later,
// from one page - no redeploys, no hard-coded keys.
export default async function IntegrationsPage() {
  const rows = await db.integrationSetting.findMany().catch(() => []);
  const settings: Record<string, { savedFields: string[]; isActive: boolean; lastTestedAt: string | null; lastTestStatus: string | null; lastTestMessage: string | null }> = {};
  for (const row of rows) {
    settings[row.provider] = {
      savedFields: row.keys && typeof row.keys === "object" ? Object.keys(row.keys as object) : [],
      isActive: row.isActive,
      lastTestedAt: row.lastTestedAt?.toISOString() ?? null,
      lastTestStatus: row.lastTestStatus as string | null,
      lastTestMessage: row.lastTestMessage
    };
  }

  const statuses = computeAllStatuses(PROVIDERS, settings);
  const readiness = overallReadiness(statuses);

  let dbConnected = false;
  try {
    await db.$queryRaw`SELECT 1`;
    dbConnected = true;
  } catch { /* not connected yet - that's what this page fixes */ }

  return (
    <section className="mx-4 mt-12 max-w-6xl">
      <h1 className="text-3xl font-semibold">Integrations</h1>
      <p className="text-white/50 text-sm mt-1">
        Add credentials whenever you're ready - the store works without them, and each provider activates the moment its keys are saved.
      </p>

      <div className="grid lg:grid-cols-[1fr_320px] gap-6 mt-6">
        <IntegrationsClient readiness={readiness}>
          <IntegrationsGrid statuses={statuses} />
        </IntegrationsClient>
        <div className="space-y-4">
          <DbStatusCard connected={dbConnected} />
          <SetupChecklist statuses={statuses} />
        </div>
      </div>
    </section>
  );
}
