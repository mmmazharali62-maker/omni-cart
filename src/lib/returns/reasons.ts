// Return reason codes (spec section 29): fixed codes keep analytics clean.
export type ReturnReasonCode =
  | "arrived-damaged" | "wrong-item" | "not-as-described" | "too-small" | "too-large"
  | "changed-mind" | "arrived-too-late" | "quality-issue" | "other";

export const RETURN_REASONS: Array<{ code: ReturnReasonCode; label: string; fault: "supplier" | "customer" | "logistics" }> = [
  { code: "arrived-damaged", label: "Arrived damaged", fault: "logistics" },
  { code: "wrong-item", label: "Wrong item sent", fault: "supplier" },
  { code: "not-as-described", label: "Not as described", fault: "supplier" },
  { code: "too-small", label: "Too small / short", fault: "customer" },
  { code: "too-large", label: "Too large / long", fault: "customer" },
  { code: "changed-mind", label: "Changed my mind", fault: "customer" },
  { code: "arrived-too-late", label: "Arrived too late", fault: "logistics" },
  { code: "quality-issue", label: "Quality issue", fault: "supplier" },
  { code: "other", label: "Other (describe below)", fault: "customer" }
];

export function reasonLabel(code: string): string {
  return RETURN_REASONS.find((r) => r.code === code)?.label ?? code;
}

// Fault-side analytics feed the supplier health score.
export function isSupplierFault(code: string): boolean {
  return RETURN_REASONS.find((r) => r.code === code)?.fault === "supplier";
}
