import { estimatedDelivery, formatWindow, SHIPPING_OPTIONS } from "@/lib/shipping/estimates";

// Delivery estimate chip (spec section 12): shows the promise up front.
export function EstimatedDelivery({ optionId = "standard", supplierLeadDays = 2, from }: { optionId?: "standard" | "express"; supplierLeadDays?: number; from?: Date }) {
  const option = SHIPPING_OPTIONS.find((o) => o.id === optionId) ?? SHIPPING_OPTIONS[0];
  const { from: lo, to: hi } = estimatedDelivery(optionId, supplierLeadDays, from ?? new Date());
  return (
    <p className="text-xs text-white/50">
      {option.label}: <span className="text-white/80">arrives {lo.toLocaleDateString()} - {hi.toLocaleDateString()}</span> ({formatWindow(option)})
    </p>
  );
}
