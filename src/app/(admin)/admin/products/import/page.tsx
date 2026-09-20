"use client";

import { useState } from "react";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

// One-click import (spec section 8): paste CJ Dropshipping / AliExpress product
// URL or ID, POST to /api/suppliers/{provider}/import, catalog entry gets created
// with title/description/images/variants/SKU/cost/inventory + pricing engine output.
export default function AdminImportPage() {
  const [provider, setProvider] = useState<"cj" | "aliexpress">("cj");
  const [productId, setProductId] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleImport() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(`/api/suppliers/${provider}/import`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ supplierProductId: productId })
      });
      const data = await res.json();
      setResult(JSON.stringify(data, null, 2));
    } catch (err) {
      setResult(`Import failed: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-2xl">
      <h1 className="text-2xl font-semibold mb-6">Import Product</h1>
      <GlassPanel>
        <label className="block text-sm text-white/70 mb-2">Supplier</label>
        <div className="flex gap-3 mb-6">
          {(["cj", "aliexpress"] as const).map((p) => (
            <Button
              key={p}
              variant={provider === p ? "primary" : "glass"}
              onClick={() => setProvider(p)}
            >
              {p === "cj" ? "CJ Dropshipping" : "AliExpress"}
            </Button>
          ))}
        </div>
        <label className="block text-sm text-white/70 mb-2">Product URL or ID</label>
        <input
          value={productId}
          onChange={(e) => setProductId(e.target.value)}
          placeholder="e.g. https://www.cjdropshipping.com/product/... or 6B7A..."
          className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400"
        />
        <Button
          variant="primary"
          className="mt-6"
          disabled={!productId || loading}
          onClick={handleImport}
        >
          {loading ? "Importing..." : "Import Product"}
        </Button>
        {result && (
          <pre className="mt-6 text-xs bg-white/5 rounded-xl p-4 overflow-auto text-white/70">{result}</pre>
        )}
        <p className="text-xs text-white/40 mt-4">
          Note: real supplier API calls require supplier credentials in environment
          variables (see .env.example). Amazon sourcing is included in the connector
          layer but needs its legally-supported sourcing model confirmed first.
        </p>
      </GlassPanel>
    </section>
  );
}
