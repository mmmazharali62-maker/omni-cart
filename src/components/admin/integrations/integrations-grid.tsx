import { PROVIDERS } from "@/lib/integrations/catalog";
import type { ProviderStatus } from "@/lib/integrations/types";
import { ProviderCard } from "./provider-card";

// Server component: the overview grid, one card per provider.
export function IntegrationsGrid({ statuses }: { statuses: ProviderStatus[] }) {
  const byId = new Map(statuses.map((s) => [s.provider, s]));

  return (
    <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
      {PROVIDERS.map((def) => (
        <ProviderCard key={def.id} status={byId.get(def.id) ?? {
          provider: def.id, label: def.label, category: def.category,
          ready: false, active: false, missing: def.fields.filter((f) => f.required).map((f) => f.label),
          lastTestedAt: null, lastTestStatus: null, lastTestMessage: null
        }} iconCategory={def.category} />
      ))}
    </div>
  );
}
