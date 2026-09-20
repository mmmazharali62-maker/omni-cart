"use client";

import { useState, useEffect } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

type Category = { id: string; name: string; slug: string };

export default function AdminNewProductPage() {
  const [form, setForm] = useState({ title: "", description: "", basePrice: "", salePrice: "", categoryId: "", images: "" });
  const [categories, setCategories] = useState<Category[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/categories")
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function addCategory() {
    if (!newCategory.trim()) return;
    const res = await fetch("/api/admin/categories", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: newCategory.trim() })
    });
    const data = await res.json();
    if (res.ok) {
      setCategories([...categories, data.category]);
      setForm({ ...form, categoryId: data.category.id });
      setNewCategory("");
    }
  }

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

          <div>
            <label className="block text-xs text-white/50 mb-2">Category</label>
            <div className="flex gap-2">
              <select value={form.categoryId} onChange={set("categoryId")} className="flex-1 glass bg-white/5 px-4 py-2.5 text-sm outline-none">
                <option value="">No category</option>
                {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
              <input value={newCategory} onChange={(e) => setNewCategory(e.target.value)} placeholder="Or create new…" className="w-40 glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
              <button type="button" onClick={addCategory} className="glass px-3 py-2.5 rounded-lg text-sm hover:bg-white/10">+</button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <input value={form.basePrice} onChange={set("basePrice")} type="number" step="0.01" placeholder="Base price (USD) *" required className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
            <input value={form.salePrice} onChange={set("salePrice")} type="number" step="0.01" placeholder="Sale price (optional)" className="glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          </div>
          <textarea value={form.images} onChange={set("images")} placeholder="Image URLs (one per line)" rows={3} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none" />
          <Button variant="primary" disabled={loading}>{loading ? "Saving..." : "Create Product"}</Button>
          {msg && <p className="text-sm text-white/70">{msg}</p>}
        </form>
      </GlassPanel>
    </section>
  );
}
