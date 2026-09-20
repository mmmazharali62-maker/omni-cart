import { GlassPanel } from "@/components/ui/glass-panel";

// Settings (spec section 32): store config, roles, integration status.
export default function AdminSettingsPage() {
  const integrations = [
    ["Database (PostgreSQL)", "DATABASE_URL"],
    ["NextAuth", "NEXTAUTH_SECRET"],
    ["Stripe payments", "STRIPE_SECRET_KEY"],
    ["Stripe webhooks", "STRIPE_WEBHOOK_SECRET"],
    ["CJ Dropshipping", "CJ_DROPSHIPPING_API_KEY"],
    ["AliExpress", "ALIEXPRESS_APP_KEY"],
    ["Amazon SP-API", "AMAZON_SP_API_CLIENT_ID"],
    ["Email provider", "EMAIL_PROVIDER_API_KEY"],
    ["SMS provider", "SMS_PROVIDER_API_KEY"],
    ["AI provider", "AI_PROVIDER_API_KEY"],
    ["Cron secret", "CRON_SECRET"]
  ] as const;

  const roles = [
    ["Admin", "Full access including refunds, settings, suppliers"],
    ["Store Manager", "Products, pricing, coupons, order cancellation"],
    ["Support", "Orders view + cancel, customer management"],
    ["Operations", "Order retry, fulfillment, inventory"],
    ["Fulfillment Manager", "Supplier fulfillment + tracking"],
    ["Customer", "Storefront, account, wishlist, orders"]
  ];

  return (
    <section className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Settings</h1>

      <GlassPanel className="mb-6">
        <h2 className="text-sm font-medium mb-4">Integration Status</h2>
        <ul className="space-y-2 text-sm">
          {integrations.map(([label, env]) => {
            const ok = Boolean(process.env[env]);
            return (
              <li key={env} className="flex items-center justify-between">
                <span className="text-white/80">{label}</span>
                <span className={`text-xs px-2 py-1 rounded-full ${ok ? "bg-emerald-500/20 text-emerald-300" : "bg-white/10 text-white/50"}`}>
                  {ok ? "connected" : "not configured"}
                </span>
              </li>
            );
          })}
        </ul>
        <p className="text-xs text-white/40 mt-4">
          Set keys in your deployment platform env settings (Vercel) - never in the repo.
        </p>
      </GlassPanel>

      <GlassPanel>
        <h2 className="text-sm font-medium mb-4">Roles & Permissions</h2>
        <table className="w-full text-sm">
          <tbody>
            {roles.map(([role, desc]) => (
              <tr key={role} className="border-t border-white/10 first:border-0">
                <td className="py-2 font-medium w-44">{role}</td>
                <td className="text-white/60">{desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </GlassPanel>
    </section>
  );
}
