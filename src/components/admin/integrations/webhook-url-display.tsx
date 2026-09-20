"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Webhook URL with copy button (Stripe endpoints are registered in the provider dashboard).
export function WebhookUrlDisplay({ label, path }: { label: string; path: string }) {
  const { copied, copy } = useCopyToClipboard();
  const origin = typeof window !== "undefined" ? window.location.origin : "https://your-domain.com";
  const url = `${origin}${path}`;

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1">
        <p className="text-xs text-white/50">{label}</p>
        <code className="text-xs font-mono text-white/80 break-all">{url}</code>
      </div>
      <button
        onClick={() => copy(url)}
        className="glass px-2 py-1 rounded-lg text-xs hover:bg-white/10 shrink-0"
      >
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
