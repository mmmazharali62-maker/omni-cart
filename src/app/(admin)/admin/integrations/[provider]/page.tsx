import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getProviderDef } from "@/lib/integrations/catalog";
import { maskSecret } from "@/lib/integrations/status";
import { ProviderForm } from "@/components/admin/integrations/provider-form";
import { TestConnectionButton } from "@/components/admin/integrations/test-connection-button";
import { LastTestedBadge } from "@/components/admin/integrations/last-tested-badge";
import { WebhookUrlDisplay } from "@/components/admin/integrations/webhook-url-display";
import { EnvHint } from "@/components/admin/integrations/env-hint";

// Per-provider setup page: form, live test, webhook URLs, env notes.
export default async function ProviderSetupPage({ params }: { params: { provider: string } }) {
  const def = getProviderDef(params.provider);
  if (!def) notFound();

  const row = await db.integrationSetting.findUnique({ where: { provider: def.id } }).catch(() => null);
  const maskedDefaults: Record<string, string> = {};
  if (row?.keys && typeof row.keys === "object") {
    // We cannot decrypt for masking here without the master key in this process,
    // so show a generic "saved" marker instead - the GET endpoint masks properly.
    for (const k of Object.keys(row.keys as object)) maskedDefaults[k] = "saved: ••••";
  }

  return (
    <section className="mx-4 mt-12 max-w-2xl">
      <h1 className="text-3xl font-semibold">{def.label}</h1>
      <p className="text-white/50 text-sm mt-1">{def.description}</p>

      <div className="glass p-6 mt-6 space-y-6">
        <LastTestedBadge
          lastTestedAt={row?.lastTestedAt?.toISOString() ?? null}
          lastTestStatus={(row?.lastTestStatus as "ok" | "fail" | null) ?? null}
          lastTestMessage={row?.lastTestMessage ?? null}
        />
        <TestConnectionButton provider={def.id} />

        <ProviderForm def={def} maskedDefaults={maskedDefaults} />

        <EnvHint envFallback={def.envFallback} />

        {def.webhooks && def.webhooks.length > 0 && (
          <div className="pt-4 border-t border-white/10 space-y-3">
            <p className="text-sm font-medium">Register this webhook in the {def.label} dashboard:</p>
            {def.webhooks.map((w) => (
              <WebhookUrlDisplay key={w.path} label={w.label} path={w.path} />
            ))}
          </div>
        )}

        <div className="pt-4 border-t border-white/10">
          <p className="text-xs text-white/40">
            Full setup guide: <code className="font-mono">{def.docsPath}</code>
            {def.docsUrl && <> - or <a href={def.docsUrl} target="_blank" rel="noreferrer" className="text-brand-400 hover:underline">the provider dashboard</a></>}
          </p>
        </div>
      </div>
    </section>
  );
}
