"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

// Light/dark toggle (spec section 2): Liquid Glass has both palettes.
export function ThemeToggle() {
  const [dark, setDark] = useLocalStorage("omni-theme", true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    document.documentElement.classList.toggle("light", !dark);
  }, [dark]);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setDark(!dark)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className="glass w-9 h-9 rounded-full grid place-items-center hover:bg-white/10"
    >
      {dark ? "☾" : "☀"}
    </button>
  );
}
