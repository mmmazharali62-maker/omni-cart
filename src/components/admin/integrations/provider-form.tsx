"use client";

import { useState } from "react";
import { SecretField } from "./secret-field";
import { SaveBar } from "./save-bar";
import type { ProviderDef } from "@/lib/integrations/types";

// The per-provider credential form. Saves via POST, never logs values.
export function ProviderForm({ def, maskedDefaults }: { def: ProviderDef; maskedDefaults: Record<string, string> }) {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    const form = new FormData(e.currentTarget);
    const keys: Record<string, string> = {};
    for (const field of def.fields) {
      const v = form.get(field.name);
      if (typeof v === "string" && v.trim()) keys[field.name] = v.trim();
    }
    if (Object.keys(keys).length === 0) {
      setMessage("Enter at least one field, or leave placeholders untouched.");
      setSaving(false);
      return;
    }
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider: def.id, keys })
      });
      const data = await res.json().catch(() => ({}));
      setMessage(res.ok ? "Saved. Values are encrypted at rest." : data.error ?? "Save failed");
    } catch {
      setMessage("Save failed - try again.");
    } finally {
      setSaving(false);
    }
  }

  async function onClear() {
    if (!confirm(`Clear all saved ${def.label} credentials? This cannot be undone.`)) return;
    setSaving(true);
    try {
      await fetch(`/api/admin/integrations/${def.id}`, { method: "DELETE" });
      setMessage("Saved keys cleared.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {def.fields.map((f) => (
        <SecretField
          key={f.name}
          name={f.name}
          label={f.label}
          required={f.required}
          placeholder={maskedDefaults[f.name] ? `saved: ${maskedDefaults[f.name]}` : f.placeholder}
          help={f.help}
          type={f.type}
          options={f.options}
        />
      ))}
      {message && <p className="text-sm text-white/70">{message}</p>}
      <SaveBar saving={saving} onSave={() => onSubmit({ currentTarget: document.querySelector("form") } as unknown as React.FormEvent<HTMLFormElement>)} onClear={onClear} />
    </form>
  );
}
