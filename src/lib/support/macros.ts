// Support macros (spec section 14): consistent one-click replies.
export const MACROS = [
  { id: "where-order", label: "Where is my order?", body: "Your order left our warehouse and is with the carrier. You can follow it live on the track-order page with your tracking number - it's also in your shipping email." },
  { id: "late-delivery", label: "Order is late", body: "Sorry your order is taking longer than promised. If it doesn't arrive within 3 business days, reply here and we'll refund the shipping cost in full." },
  { id: "refund-status", label: "Refund status", body: "Refunds are issued within 48 hours of us receiving your return, then take 5-10 business days to show on your statement. If it's been longer, we'll chase your bank right away." },
  { id: "damaged-item", label: "Damaged item", body: "Really sorry about that. Please reply with a photo of the damage and we'll ship a replacement immediately - no return needed for damaged goods." },
  { id: "cancel-order", label: "Cancel order", body: "If your order hasn't shipped yet, we can cancel it for a full refund. If it has, you can refuse delivery or use our free 30-day returns." },
  { id: "address-change", label: "Change address", body: "We can update the address if the order hasn't shipped. Reply with the correct full address and we'll confirm within an hour." }
] as const;

export type MacroId = (typeof MACROS)[number]["id"];

export function macro(id: string): (typeof MACROS)[number] | undefined {
  return MACROS.find((m) => m.id === id);
}

// Macros never auto-send - they prefill the reply for a human to review.
export function isSafeToPrefill(ticketStatus: string): boolean {
  return ["open", "pending"].includes(ticketStatus);
}
