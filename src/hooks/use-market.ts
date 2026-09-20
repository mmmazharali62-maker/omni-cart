"use client";

import { useEffect, useState } from "react";

// Detect the visitor's market (US default) from the omni-market cookie.
export function useMarket(): "US" | "GB" {
  const [market, setMarket] = useState<"US" | "GB">("US");

  useEffect(() => {
    const match = document.cookie.match(/omni-market=(US|GB)/);
    if (match) setMarket(match[1] as "US" | "GB");
    else {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz?.startsWith("Europe/")) setMarket("GB");
    }
  }, []);

  return market;
}
