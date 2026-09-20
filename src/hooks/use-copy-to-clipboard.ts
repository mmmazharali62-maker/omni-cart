"use client";

import { useState } from "react";

// Copy helper with a transient "copied" flag (tracking numbers, codes).
export function useCopyToClipboard(resetMs = 2000) {
  const [copied, setCopied] = useState(false);

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), resetMs);
      return true;
    } catch {
      return false;
    }
  }

  return { copied, copy };
}
