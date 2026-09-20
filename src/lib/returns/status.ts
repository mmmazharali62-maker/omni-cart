// Return status state machine (spec section 29): legal transitions only.
export const RETURN_STATUSES = ["requested", "approved", "received", "refunded", "rejected", "cancelled"] as const;
export type ReturnStatus = (typeof RETURN_STATUSES)[number];

const TRANSITIONS: Record<ReturnStatus, ReturnStatus[]> = {
  requested: ["approved", "rejected", "cancelled"],
  approved: ["received", "rejected", "cancelled"],
  received: ["refunded", "rejected"],
  refunded: [],
  rejected: [],
  cancelled: []
};

export function canTransition(from: string, to: string): boolean {
  const f = from as ReturnStatus;
  return TRANSITIONS[f]?.includes(to as ReturnStatus) ?? false;
}

// Customer-visible copy per status.
export const STATUS_COPY: Record<ReturnStatus, { label: string; blurb: string }> = {
  requested: { label: "Requested", blurb: "We got your request and review it within 24 hours." },
  approved: { label: "Approved", blurb: "Send the item back using the instructions we emailed." },
  received: { label: "Received", blurb: "The item reached our warehouse; your refund is processing." },
  refunded: { label: "Refunded", blurb: "The refund is on its way to your original payment method." },
  rejected: { label: "Rejected", blurb: "We couldn't approve this return; check your email for details." },
  cancelled: { label: "Cancelled", blurb: "You cancelled this return request." }
};
