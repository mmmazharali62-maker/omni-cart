"use client";

import { useState } from "react";

// Quantity stepper used by add-to-cart and the cart page.
export function QuantityInput({
  value,
  onChange,
  max = 99,
  min = 1
}: {
  value: number;
  onChange: (next: number) => void;
  max?: number;
  min?: number;
}) {
  const [draft, setDraft] = useState(String(value));
  const clamp = (n: number) => Math.min(max, Math.max(min, n));

  function commit() {
    const n = parseInt(draft, 10);
    if (Number.isNaN(n)) {
      setDraft(String(value));
      return;
    }
    const next = clamp(n);
    setDraft(String(next));
    if (next !== value) onChange(next);
  }

  return (
    <div className="flex glass rounded-lg overflow-hidden" role="group" aria-label="Quantity">
      <button
        type="button"
        aria-label="Decrease quantity"
        className="px-3 py-2 hover:bg-white/10 disabled:opacity-30"
        disabled={value <= min}
        onClick={() => { const next = clamp(value - 1); setDraft(String(next)); onChange(next); }}
      >
        −
      </button>
      <input
        type="number"
        inputMode="numeric"
        aria-label="Quantity"
        value={draft}
        min={min}
        max={max}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        className="w-12 bg-transparent text-center outline-none [appearance:textfield]"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="px-3 py-2 hover:bg-white/10 disabled:opacity-30"
        disabled={value >= max}
        onClick={() => { const next = clamp(value + 1); setDraft(String(next)); onChange(next); }}
      >
        +
      </button>
    </div>
  );
}
