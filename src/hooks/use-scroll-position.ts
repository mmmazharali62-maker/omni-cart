"use client";

import { useEffect, useState } from "react";

// Window scroll offset - navbar effects, back-to-top buttons.
export function useScrollPosition(): number {
  const [y, setY] = useState(0);
  useEffect(() => {
    const onScroll = () => setY(window.scrollY);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return y;
}
