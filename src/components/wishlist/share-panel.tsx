"use client";

import { useState } from "react";
import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";
import { Spinner } from "@/components/ui/spinner";

// Share your wishlist via a private link (spec section 6).
export function SharePanel() {
  const [token, setToken] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const { copied, copy } = useCopyToClipboard();

  async function createShare() {
    setBusy(true);
    try {
      const res = await fetch("/api/wishlist/share", { method: "POST" });
      const data = await res.json().catch(() => ({}));
      if (res.ok) setToken(data.token ?? null);
    } finally {
      setBusy(false);
    }
  }

  const url = token ? `${typeof window !== "undefined" ? window.location.origin : ""}/wishlist/shared/${token}` : null;

  return (
    <div className="glass p-4 flex items-center gap-3 flex-wrap">
      {url ? (
        <>
          <code className="text-xs font-mono text-white/70 truncate flex-1">{url}</code>
          <button onClick={() => copy(url)} className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10">
            {copied ? "Copied!" : "Copy link"}
          </button>
          <a href={url} target="_blank" rel="noreferrer" className="text-xs text-brand-400 hover:underline">Preview</a>
        </>
      ) : (
        <button onClick={createShare} disabled={busy} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
          {busy && <Spinner size={14} />} Create share link
        </button>
      )}
    </div>
  );
}
