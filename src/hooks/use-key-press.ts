"use client";

import { useEffect } from "react";

// Keyboard shortcuts - "/" focuses search, Escape closes modals, etc.
export function useKeyPress(handler: (key: string, event: KeyboardEvent) => void) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => handler(e.key, e);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handler]);
}
