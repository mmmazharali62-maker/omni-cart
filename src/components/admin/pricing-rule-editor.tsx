"use client";

import { useState } from "react";

type Rule = {
  id: string; name: string; type: string; value: string;
  categoryId: string | null; supplierId: string | null;
  roundTo: string | null; priority: number;
};

export function PricingRuleEditor({ initialRules }: { initialRules: Rule[] }) {
  const [rules, setRules] = useState(initialRules);
  const [form, setForm] = useState({ name: "", type: "percentage_markup", value: "50", roundTo: "", priority: "0" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function createRule(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    const res = await fetch("/api/admin/pricing-rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        type: form.type,
        value: Number(form.value),
        roundTo: form.roundTo || undefined,
        priority: Number(form.priority)
      })
    });
    const data = await res.json();
    setLoading(false);
    if (res.ok) {
      setRules([...rules, data.rule]);
      setForm({ ...form, name: "" });
      setMsg(`Rule "${data.rule.name}" saved`);
    } else setMsg(data.error ?? "Failed");
  }

  async function removeRule(id: string) {
    await fetch(`/api/admin/pricing-rules/${id}`, { method: "DELETE" });
    setRules(rules.filter((r) => r.id !== id));
  }

  return (
    <div>
      <form onSubmit={createRule} className="space-y-3">
        <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Rule name *" required minLength={2} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
        <div className="grid grid-cols-2 gap-3">
          <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="glass bg-white/5 px-4 py-2.5 text-sm outline-none">
            <option value="percentage_markup">Percentage markup</option>
            <option value="fixed_markup">Fixed markup ($)</option>
          </select>
          <input value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} type="number" step="0.01" placeholder={form.type === "percentage_markup" ? "Percent (e.g. 50) *" : "Dollars (e.g. 5) *"} required className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <select value={form.roundTo} onChange={(e) => setForm({ ...form, roundTo: e.target.value })} className="glass bg-white/5 px-4 py-2.5 text-sm outline-none">
            <option value="">No rounding</option>
            <option value="0.99">Round to .99</option>
            <option value="0.95">Round to .95</option>
          </select>
          <input value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} type="number" placeholder="Priority" className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
        </div>
        <button disabled={loading} className="w-full glass px-4 py-2.5 rounded-lg text-sm hover:bg-white/10">
          {loading ? "Saving..." : "Add Rule"}
        </button>
        {msg && <p className="text-xs text-white/70">{msg}</p>}
      </form>

      <ul className="mt-6 space-y-2">
        {rules.map((r) => (
          <li key={r.id} className="glass bg-white/5 p-3 rounded-xl flex items-center justify-between text-sm">
            <div>
              <p className="font-medium">{r.name}</p>
              <p className="text-xs text-white/50">
                {r.type === "percentage_markup" ? `+${r.value}%` : `+$${r.value}`}
                {r.roundTo ? ` · .${r.roundTo.slice(-2)}` : ""} · priority {r.priority}
              </p>
            </div>
            <button onClick={() => removeRule(r.id)} className="text-xs text-red-300 hover:text-red-200">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
