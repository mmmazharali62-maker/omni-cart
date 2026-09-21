"use client";

import { useEffect, useState } from "react";

const KEY = "omni-compare";
const MAX = 4;

// Compare tray state (spec section 3): titles in localStorage, ids on the URL.
export function useCompare() {
  const [titles, setTitles] = useState<string[]>([]);

  useEffect(() => {
    try { setTitles(JSON.parse(localStorage.getItem(KEY) ?? "[]")); } catch { /* ignore */ }
  }, []);

  function persist(next: string[]) {
    setTitles(next);
    localStorage.setItem(KEY, JSON.stringify(next));
  }

  return {
    items: titles,
    add: (title: string) => persist([...new Set([...titles, title])].slice(-MAX)),
    remove: (title: string) => persist(titles.filter((t) => t !== title)),
    clear: () => persist([])
  };
}
