"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Copy-link share button for products and collections.
export function ShareButton({ path, label = "Share" }: { path: string; label?: string }) {
  const { copied, copy } = useCopyToClipboard();
  const url = typeof window !== "undefined" ? `${window.location.origin}${path}` : path;

  return (
    <button
      onClick={() => copy(url)}
      className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10"
      aria-label={`${label}: copy link`}
    >
      {copied ? "Link copied!" : label}
    </button>
  );
}
