"use client";

import { useEffect, useState } from "react";

// Deal countdown for the hero (spec section 1/15): ends at UTC midnight.
export function HeroCountdown({ label = "Deal ends in" }: { label?: string }) {
  const [remaining, setRemaining] = useState("");

  useEffect(() => {
    function tick() {
      const end = new Date();
      end.setUTCHours(23, 59, 59, 999);
      const ms = Math.max(0, end.getTime() - Date.now());
      const h = Math.floor(ms / 3_600_000);
      const m = Math.floor((ms % 3_600_000) / 60_000);
      const s = Math.floor((ms % 60_000) / 1000);
      setRemaining(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <p className="text-sm text-white/60">
      {label} <span className="font-mono font-semibold text-brand-400 tabular-nums">{remaining}</span>
    </p>
  );
}
