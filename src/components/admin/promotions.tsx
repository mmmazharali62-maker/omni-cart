"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

export function PricingRulesPanel() {
  // Placeholder UI for the pricing rules store; rules are applied by src/lib/pricing-engine.ts.
  return (
    <GlassPanel>
      <h2 className="text-sm font-medium mb-4">Automatic Pricing Rules</h2>
      <div className="space-y-3 text-sm text-white/70">
        <p className="text-white/50 text-xs">Rules feed the pricing engine used at import + sync time.</p>
        <div className="glass bg-white/5 p-4 rounded-xl">
          <p className="font-medium text-white">Default: +50% markup</p>
          <p className="text-xs text-white/50 mt-1">Applies to every product without a supplier/category-specific rule.</p>
        </div>
        <div className="glass bg-white/5 p-4 rounded-xl">
          <p className="font-medium text-white">Rounding: .99</p>
          <p className="text-xs text-white/50 mt-1">$14.23 becomes $14.99.</p>
        </div>
      </div>
      <p className="text-xs text-white/40 mt-4">Rule editor UI + persistence is the next step; engine itself is live and tested.</p>
    </GlassPanel>
  );
}

export function CouponCreator() {
  const [form, setForm] = useState({ code: "", type: "percentage", value: "", minOrderAmount: "", usageLimit: "", endsAt: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        type: form.type,
        value: form.value ? Number(form.value) : undefined,
        minOrderAmount: form.minOrderAmount ? Number(form.minOrderAmount) : undefined,
        usageLimit: form.usageLimit ? Number(form.usageLimit) : undefined,
        endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : undefined
      })
    });
    const data = await res.json();
    setLoading(false);
    setMsg(res.ok ? `Coupon ${data.coupon.code} created` : data.error ?? "Failed");
    if (res.ok) setForm({ code: "", type: "percentage", value: "", minOrderAmount: "", usageLimit: "", endsAt: "" });
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="CODE *" required minLength={3} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none font-mono" />
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none">
        <option value="percentage">Percentage off</option>
        <option value="fixed">Fixed amount off</option>
        <option value="free_shipping">Free shipping</option>
      </select>
      {form.type !== "free_shipping" && (
        <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} type="number" step="0.01" placeholder={form.type === "percentage" ? "Percent (e.g. 10) *" : "Amount off (USD) *"} required className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
      )}
      <div className="grid grid-cols-2 gap-3">
        <input value={form.minOrderAmount} onChange={(e) => setForm({ ...form, minOrderAmount: e.target.value })} type="number" step="0.01" placeholder="Min order $" className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
        <input value={form.usageLimit} onChange={(e) => setForm({ ...form, usageLimit: e.target.value })} type="number" placeholder="Usage limit" className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
      </div>
      <input value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} type="date" className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
      <Button variant="primary" disabled={loading} className="w-full">{loading ? "Creating..." : "Create Coupon"}</Button>
      {msg && <p className="text-xs text-white/70">{msg}</p>}
    </form>
  );
}
