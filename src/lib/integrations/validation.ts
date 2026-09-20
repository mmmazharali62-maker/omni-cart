import { z } from "zod";
import { getProviderDef } from "./catalog";

// Zod schemas for the integrations API (spec section 17: validate every write).
export const saveKeysSchema = z.object({
  provider: z.string().min(2).max(40),
  keys: z.record(z.string().max(2000)).refine((k) => Object.keys(k).length > 0, "At least one field is required")
});

export const testProviderSchema = z.object({
  provider: z.string().min(2).max(40)
});

// Only catalog field names are accepted for a provider.
export function validFieldNames(providerId: string, submitted: string[]): boolean {
  const def = getProviderDef(providerId);
  if (!def) return false;
  const allowed = new Set(def.fields.map((f) => f.name));
  return submitted.every((name) => allowed.has(name));
}
