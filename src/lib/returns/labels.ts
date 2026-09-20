// Return shipping instructions (spec section 29): plain, printable text.
import { reasonLabel } from "./reasons";

export function returnInstructions(orderNumber: string, reason: string): string {
  return [
    `Return for order ${orderNumber}`,
    `Reason: ${reasonLabel(reason)}`,
    "",
    "How to return:",
    "1. Pack the item in its original packaging (or similar).",
    "2. Include this note inside the parcel.",
    `3. Write the order number (${orderNumber}) on the outside.`,
    "4. Drop the parcel at any USPS / Royal Mail location within 14 days.",
    "5. Keep the receipt until your refund lands (5-10 business days after we receive it).",
    "",
    "Refund: issued to your original payment method."
  ].join("\n");
}
