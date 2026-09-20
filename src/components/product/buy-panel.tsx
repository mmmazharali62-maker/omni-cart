"use client";

import { useState } from "react";
import { VariantPicker, type VariantOption } from "./variant-picker";
import { AddToCartButtons } from "./add-to-cart";

// Client island: variant selection + add-to-cart state coordination.
export function BuyPanel({ variants, outOfStock }: { variants: VariantOption[]; outOfStock: boolean }) {
  const [selectedId, setSelectedId] = useState(variants[0]?.id ?? null);
  const selected = variants.find((v) => v.id === selectedId);
  const disabled = outOfStock || (selected ? selected.stock <= 0 : true);

  return (
    <div className="mt-6 space-y-4">
      {variants.length > 1 && <VariantPicker variants={variants} onSelect={setSelectedId} />}
      {selected && <p className="text-xs text-white/50">{selected.stock} in stock</p>}
      <AddToCartButtons variantId={selectedId} disabled={disabled} />
    </div>
  );
}
