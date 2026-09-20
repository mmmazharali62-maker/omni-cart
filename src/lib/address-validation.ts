import { z } from "zod";

// Shared address validation (spec section 5/16): US + UK postcodes.
const US_ZIP = /^\d{5}(-\d{4})?$/;
const UK_POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s*\d[A-Z]{2}$/i;

export const addressSchema = z.object({
  fullName: z.string().min(2).max(120),
  line1: z.string().min(3).max(200),
  line2: z.string().max(200).optional(),
  city: z.string().min(1).max(100),
  state: z.string().max(100).optional(),
  postalCode: z.string().min(3).max(10),
  country: z.enum(["US", "GB"]),
  phone: z.string().max(20).optional()
}).refine(
  (a) => (a.country === "US" ? US_ZIP.test(a.postalCode) : UK_POSTCODE.test(a.postalCode)),
  { message: "Postal code doesn't match the selected country", path: ["postalCode"] }
);

export type AddressInput = z.infer<typeof addressSchema>;

export function formatAddress(a: AddressInput): string {
  return [a.line1, a.line2, `${a.city}${a.state ? ", " + a.state : ""}`, a.postalCode, a.country]
    .filter(Boolean)
    .join(", ");
}
