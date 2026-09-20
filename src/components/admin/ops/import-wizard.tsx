"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// CSV import wizard (spec section 10/14): paste or upload, preview, import.
export function ImportWizard() {
  const [source, setSource] = useState<"cj" | "aliexpress" | "amazon" | "csv">("cj");
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ imported?: number; errors?: string[]; message?: string } | null>(null);

  async function runImport() {
    setBusy(true);
    setResult(null);
    try {
      const res = await fetch(source === "csv" ? "/api/admin/import-csv" : "/api/admin/import", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(source === "csv" ? { csv: input } : { source, url: input })
      });
      setResult(await res.json().catch(() => ({ message: "Done" })));
    } catch {
      setResult({ message: "Import failed - try again" });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="glass p-5 space-y-4">
      <div className="flex gap-2" role="tablist" aria-label="Import source">
        {(["cj", "aliexpress", "amazon", "csv"] as const).map((s) => (
          <button
            key={s}
            role="tab"
            aria-selected={source === s}
            onClick={() => { setSource(s); setInput(""); setResult(null); }}
            className={`glass px-3 py-1.5 rounded-lg text-sm capitalize ${source === s ? "bg-brand-600" : "hover:bg-white/10"}`}
          >
            {s === "csv" ? "CSV file" : s}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-sm text-white/70">
          {source === "csv" ? "Paste CSV content" : `Paste a ${source.toUpperCase()} product URL`}
        </span>
        {source === "csv" ? (
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            rows={8}
            placeholder="title,price,stock&#10;Wireless Earbuds,29.99,50"
            className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-xs font-mono outline-none"
          />
        ) : (
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`https://www.${source === "cj" ? "cjdropshipping.com" : source === "aliexpress" ? "aliexpress.com" : "amazon.com"}/item/...`}
            className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
          />
        )}
      </label>
      <button
        onClick={runImport}
        disabled={busy || input.trim().length < 5}
        className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2"
      >
        {busy && <Spinner size={14} />} {source === "csv" ? "Import CSV" : "Import product"}
      </button>
      {result && (
        <div className="text-sm">
          {result.imported !== undefined && <p className="text-emerald-300">Imported {result.imported} product(s).</p>}
          {result.message && !result.imported && <p className="text-white/70">{result.message}</p>}
          {result.errors?.map((e, i) => (
            <p key={i} className="text-xs text-amber-300 mt-1">{e}</p>
          ))}
        </div>
      )}
    </div>
  );
}
