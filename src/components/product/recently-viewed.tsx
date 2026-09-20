"use client";

import { useEffect } from "react";

// Tracks recently-viewed products in localStorage; the homepage rail
// hydrates from this on the client (spec section 1/3).
const KEY = "omnicart_recently_viewed";
const MAX = 12;

export function trackProductView(productId: string) {
  if (typeof window === "undefined") return;
  try {
    const current: string[] = JSON.parse(localStorage.getItem(KEY) ?? "[]");
    const next = [productId, ...current.filter((id) => id !== productId)].slice(0, MAX);
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch { /* storage unavailable - skip silently */ }
}

export function getRecentlyViewed(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function RecentlyViewedTracker({ productId }: { productId: string }) {
  useEffect(() => { trackProductView(productId); }, [productId]);
  return null;
}
