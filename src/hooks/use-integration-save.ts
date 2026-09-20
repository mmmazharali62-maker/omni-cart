"use client";

import { useState } from "react";

// Save a provider's credentials through the encrypted store API.
export function useIntegrationSave() {
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function save(provider: string, keys: Record<string, string>) {
    setSaving(true);
    setMessage(null);
    setError(null);
    try {
      const res = await fetch("/api/admin/integrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, keys })
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setMessage(data.message ?? "Saved");
      else setError(data.error ?? "Save failed");
      return res.ok;
    } catch {
      setError("Save failed - check your connection.");
      return false;
    } finally {
      setSaving(false);
    }
  }

  return { saving, message, error, save };
}
