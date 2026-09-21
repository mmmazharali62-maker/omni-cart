"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Read-only value + copy button (share links, codes).
export function CopyField({ label, value }: { label?: string; value: string }) {
  const { copied, copy } = useCopyToClipboard();
  return (
    <div className="glass rounded-lg flex items-center overflow-hidden">
      {label && <span className="pl-3 text-xs text-white/40">{label}</span>}
      <input
        readOnly
        value={value}
        onFocus={(e) => e.currentTarget.select()}
        aria-label={label ?? "Copy this value"}
        className="flex-1 bg-transparent px-3 py-2 text-sm font-mono outline-none text-white/70"
      />
      <button onClick={() => copy(value)} className="px-3 py-2 text-xs text-brand-400 hover:text-brand-300">
        {copied ? "Copied!" : "Copy"}
      </button>
    </div>
  );
}
