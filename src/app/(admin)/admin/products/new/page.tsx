"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

export default function AdminNewProductPage() {
  const [form, setForm] = useState({ title: "", description: "", basePrice: "", salePrice: "", categoryId: "", images: "" });
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);
    try {
      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title,
          description: form.description,
          categoryId: form.categoryId || undefined,
          basePrice: Number(form.basePrice),
          salePrice: form.salePrice ? Number(form.salePrice) : undefined,
          images: form.images ? form.images.split("\n").map((s) => s.trim()).filter(Boolean) : []
        })
      });
      const data = await res.json();
      setMsg(res.ok ? `Created: ${data.product.slug}` : data.error ?? "Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">New Product</h1>
      <GlassPanel>
        <form onSubmit={submit} className="space-y-4">
          <input value={form.title} onChange={set("title")} placeholder="Title *" required minLength={3} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          <textarea value={form.description} onChange={set("description")} placeholder="Description" rows={4} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          <div className="grid grid-cols-2 gap-4">
            <input value={form.basePrice} onChange={set("basePrice")} type="number" step="0.01" placeholder="Base price (USD) *" required className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
            <input value={form.salePrice} onChange={set("salePrice")} type="number" step="0.01" placeholder="Sale price (optional)" className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          </div>
          <input value={form.categoryId} onChange={set("categoryId")} placeholder="Category ID (optional)" className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          <textarea value={form.images} onChange={set("images")} placeholder="Image URLs (one per line)" rows={3} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          <Button variant="primary" disabled={loading}>{loading ? "Saving..." : "Create Product"}</Button>
          {msg && <p className="text-sm text-white/70">{msg}</p>}
        </form>
      </GlassPanel>
    </section>
  );
}
