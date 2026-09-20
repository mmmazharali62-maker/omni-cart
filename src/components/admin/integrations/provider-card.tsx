import Link from "next/link";
import type { ProviderStatus } from "@/lib/integrations/types";
import { ProviderIcon } from "./provider-icon";
import { StatusPill } from "./status-pill";

// Catalog card on the Integrations overview page.
export function ProviderCard({ status, iconCategory }: { status: ProviderStatus; iconCategory: "database" | "payments" | "supplier" | "notifications" }) {
  return (
    <Link
      href={`/admin/integrations/${status.provider}`}
      className="glass p-5 block hover:bg-white/5 transition-colors"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <ProviderIcon category={iconCategory} label={status.label} />
          <div>
            <p className="font-medium">{status.label}</p>
            <p className="text-xs text-white/40 capitalize">{iconCategory}</p>
          </div>
        </div>
        <StatusPill ready={status.ready} active={status.active} />
      </div>
      {status.missing.length > 0 ? (
        <p className="text-xs text-amber-300/80 mt-3">Missing: {status.missing.join(", ")}</p>
      ) : (
        <p className="text-xs text-emerald-400/80 mt-3">All required fields saved</p>
      )}
    </Link>
  );
}
