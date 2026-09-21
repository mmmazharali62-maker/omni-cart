"use client";

import { useCopyToClipboard } from "@/hooks/use-copy-to-clipboard";

// Referral share card (spec section 15): $5 for you, $5 for them.
export function ReferralCard({ code }: { code: string }) {
  const { copied, copy } = useCopyToClipboard();
  const link = typeof window !== "undefined" ? `${window.location.origin}/?ref=${code}` : `/?ref=${code}`;

  return (
    <div className="glass p-6 text-center">
      <p className="text-sm text-white/60">Give $5, get $5</p>
      <p className="text-xs text-white/40 mt-1">Your friend gets $5 off their first order over $15. You get $5 when it delivers.</p>
      <code className="block font-mono text-2xl font-semibold tracking-wider my-5">{code}</code>
      <div className="flex gap-2 justify-center">
        <button onClick={() => copy(link)} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium">
          {copied ? "Copied!" : "Copy invite link"}
        </button>
      </div>
    </div>
  );
}
