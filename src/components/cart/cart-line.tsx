"use client";

// A single cart row: quantity stepper, variant info, line total, remove/save-for-later.
// Purely presentational now; client actions wire up once the cart API is fleshed out.
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";
import type { CartLine } from "@/types";

export function CartLineRow({
  line,
  onUpdateQty,
  onRemove
}: {
  line: CartLine;
  onUpdateQty?: (variantId: string, qty: number) => void;
  onRemove?: (variantId: string) => void;
}) {
  return (
    <GlassPanel className="flex items-center gap-4 p-4">
      <div className="w-20 h-20 rounded-xl bg-white/10 shrink-0" />
      <div className="flex-1 min-w-0">
        <p className="text-sm text-white/90 truncate">{line.title}</p>
        <p className="text-xs text-white/50 mt-1">SKU {line.sku}</p>
        <div className="flex gap-3 mt-2 text-xs">
          <button className="hover:text-white text-white/60" onClick={() => onUpdateQty?.(line.variantId, line.quantity - 1)}>-</button>
          <span className="text-white/80">{line.quantity}</span>
          <button className="hover:text-white text-white/60" onClick={() => onUpdateQty?.(line.variantId, line.quantity + 1)}>+</button>
          <button className="hover:text-white text-white/60 ml-4" onClick={() => onRemove?.(line.variantId)}>Remove</button>
        </div>
      </div>
      <p className="font-semibold">{formatMoney(line.unitPrice * line.quantity)}</p>
    </GlassPanel>
  );
}
