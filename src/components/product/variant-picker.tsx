"use client";

import { useState } from "react";

// Groups variant options (e.g. color/size) into selectable groups (spec section 3).
export type VariantOption = {
  id: string;
  options: Record<string, string>;
  price: number;
  stock: number;
};

export function VariantPicker({
  variants,
  onSelect,
}: {
  variants: VariantOption[];
  onSelect: (variantId: string) => void;
}) {
  const optionKeys = [...new Set(variants.flatMap((v) => Object.keys(v.options)))];
  const [selected, setSelected] = useState<Record<string, string>>(
    Object.fromEntries(optionKeys.map((k) => [k, variants[0]?.options[k] ?? ""]))
  );

  function choose(key: string, value: string) {
    const next = { ...selected, [key]: value };
    setSelected(next);
    const match = variants.find(
      (v) => optionKeys.every((k) => next[k] === undefined || v.options[k] === next[k])
    );
    if (match) onSelect(match.id);
  }

  return (
    <div className="space-y-4">
      {optionKeys.map((key) => {
        const values = [...new Set(variants.map((v) => v.options[key]).filter(Boolean))];
        if (values.length <= 1) return null;
        return (
          <div key={key}>
            <p className="text-xs text-white/50 mb-2 capitalize">{key}</p>
            <div className="flex flex-wrap gap-2">
              {values.map((val) => {
                const active = selected[key] === val;
                const inStock = variants.some((v) => v.options[key] === val && v.stock > 0);
                return (
                  <button
                    key={val}
                    onClick={() => choose(key, val)}
                    disabled={!inStock}
                    className={`px-4 py-2 rounded-lg text-sm capitalize transition-colors ${
                      active ? "bg-brand-600 text-white" : "glass hover:bg-white/10"
                    } ${!inStock ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {val}
                    {!inStock && <span className="text-xs ml-1">(out)</span>}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
