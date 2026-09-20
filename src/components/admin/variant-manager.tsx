"use client";

import { useState } from "react";

type Variant = { id: string; sku: string; options: Record<string, string>; price: number; stock: number };

export function VariantManager({ productId, initialVariants }: { productId: string; initialVariants: Variant[] }) {
  const [variants, setVariants] = useState(initialVariants);
  const [form, setForm] = useState({ optionKey: "color", optionValue: "", sku: "", price: "", stock: "0" });
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function addVariant(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/admin/variants", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        productId,
        sku: form.sku,
        options: { [form.optionKey]: form.optionValue },
        price: Number(form.price),
        stock: Number(form.stock)
      })
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      setVariants([...variants, { id: data.variant.id, sku: data.variant.sku, options: form.optionKey ? { [form.optionKey]: form.optionValue } : {}, price: Number(form.price), stock: Number(form.stock) }]);
      setForm({ ...form, sku: "", optionValue: "", price: "" });
      setMsg("Variant added");
    } else setMsg(data.error ?? "Failed");
  }

  async function updateStock(v: Variant, stock: number) {
    await fetch(`/api/admin/variants/${v.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock })
    });
    setVariants(variants.map((x) => (x.id === v.id ? { ...x, stock } : x)));
  }

  return (
    <div>
      <ul className="space-y-2 mb-6">
        {variants.map((v) => (
          <li key={v.id} className="glass bg-white/5 p-3 rounded-xl text-sm flex items-center justify-between">
            <div>
              <p className="font-mono text-xs">{v.sku}</p>
              <p className="text-white/60 text-xs mt-1">{Object.entries(v.options).map(([k, val]) => `${k}: ${val}`).join(" · ")} · ${v.price}</p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <input
                type="number" defaultValue={v.stock} min={0}
                onBlur={(e) => updateStock(v, Number(e.target.value))}
                className="w-16 glass bg-white/5 px-2 py-1 rounded-lg outline-none"
              />
            </div>
          </li>
        ))}
      </ul>

      <form onSubmit={addVariant} className="space-y-3 border-t border-white/10 pt-4">
        <p className="text-xs text-white/50">Add variant</p>
        <div className="grid grid-cols-2 gap-2">
          <input value={form.optionKey} onChange={(e) => setForm({ ...form, optionKey: e.target.value })} placeholder="Option name (color)" className="glass bg-white/5 px-3 py-2 text-sm rounded-lg outline-none" />
          <input value={form.optionValue} onChange={(e) => setForm({ ...form, optionValue: e.target.value })} placeholder="Value (red)" required className="glass bg-white/5 px-3 py-2 text-sm rounded-lg outline-none" />
        </div>
        <div className="grid grid-cols-3 gap-2">
          <input value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} placeholder="SKU *" required className="glass bg-white/5 px-3 py-2 text-sm rounded-lg outline-none font-mono" />
          <input value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} type="number" step="0.01" placeholder="Price *" required className="glass bg-white/5 px-3 py-2 text-sm rounded-lg outline-none" />
          <input value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} type="number" placeholder="Stock" className="glass bg-white/5 px-3 py-2 text-sm rounded-lg outline-none" />
        </div>
        <button disabled={busy} className="w-full glass px-4 py-2.5 rounded-lg text-sm hover:bg-white/10">{busy ? "Adding..." : "Add Variant"}</button>
        {msg && <p className="text-xs text-white/70">{msg}</p>}
      </form>
    </div>
  );
}

export function ProductStatusControls({ productId, currentStatus }: { productId: string; currentStatus: string }) {
  const [status, setStatus] = useState(currentStatus);
  const [busy, setBusy] = useState(false);

  async function change(next: string) {
    setBusy(true);
    const res = await fetch(`/api/admin/products/${productId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next })
    });
    setBusy(false);
    if (res.ok) setStatus(next);
  }

  return (
    <div className="flex gap-2">
      {["draft", "active", "archived"].map((s) => (
        <button
          key={s}
          disabled={busy}
          onClick={() => change(s)}
          className={`px-4 py-2 rounded-lg text-sm capitalize ${status === s ? "bg-brand-600 text-white" : "glass hover:bg-white/10"}`}
        >
          {s}
        </button>
      ))}
    </div>
  );
}
