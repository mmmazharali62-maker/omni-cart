import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { PricingRuleEditor } from "@/components/admin/pricing-rule-editor";
import { CouponCreator } from "@/components/admin/promotions";

// Pricing rules + coupon management (spec section 10 + 19) - now fully persisted.
export default async function AdminPricingPage() {
  const [rules, coupons] = await Promise.all([
    db.pricingRule.findMany({ orderBy: [{ priority: "desc" }, { createdAt: "desc" }] }).catch(() => []),
    db.coupon.findMany({ orderBy: { createdAt: "desc" } }).catch(() => [])
  ]);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Pricing & Promotions</h1>
      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Automatic Pricing Rules</h2>
          <p className="text-white/50 text-xs mb-4">
            Applied at import + sync time: supplier &gt; category &gt; default scope.
          </p>
          <PricingRuleEditor
            initialRules={rules.map((r) => ({
              id: r.id, name: r.name, type: r.type, value: String(r.value),
              categoryId: r.categoryId, supplierId: r.supplierId, roundTo: r.roundTo, priority: r.priority
            }))}
          />
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Create Coupon</h2>
          <CouponCreator />
          <h2 className="text-sm font-medium mt-8 mb-4">Active Coupons</h2>
          {coupons.length === 0 ? (
            <p className="text-white/50 text-sm">No coupons yet.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="text-white/50 text-xs">
                <tr><th className="text-left py-2">Code</th><th className="text-left">Type</th><th className="text-left">Used</th><th className="text-left">Active</th></tr>
              </thead>
              <tbody>
                {coupons.map((c) => (
                  <tr key={c.id} className="border-t border-white/10">
                    <td className="py-2 font-mono">{c.code}</td>
                    <td className="text-white/70">{c.type === "free_shipping" ? "Free ship" : `${c.value}${c.type === "percentage" ? "%" : ""}`}</td>
                    <td className="text-white/70">{c.timesUsed}{c.usageLimit ? `/${c.usageLimit}` : ""}</td>
                    <td><span className={c.isActive ? "text-emerald-400" : "text-white/40"}>{c.isActive ? "yes" : "no"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </GlassPanel>
      </div>
    </section>
  );
}
