// Admin bulk operations (spec section 14): one validated command language.
import { z } from "zod";

export const BULK_COMMANDS = ["activate", "deactivate", "delete", "adjust-price", "reassign-supplier", "export"] as const;
export type BulkCommand = (typeof BULK_COMMANDS)[number];

export const bulkActionSchema = z.object({
  command: z.enum(BULK_COMMANDS),
  productIds: z.array(z.string()).min(1).max(500),
  // adjust-price only
  adjustPct: z.number().min(-90).max(500).optional(),
  // reassign-supplier only
  supplierId: z.string().max(64).optional()
});

export type BulkAction = z.infer<typeof bulkActionSchema>;

// Commands that can't be undone need a stricter admin role.
export const DESTRUCTIVE: BulkCommand[] = ["delete"];

export function requiresOwnerRole(command: BulkCommand): boolean {
  return DESTRUCTIVE.includes(command);
}

export function validateBulkAction(action: BulkAction): string | null {
  if (action.command === "adjust-price" && action.adjustPct === undefined) {
    return "adjust-price requires adjustPct";
  }
  if (action.command === "reassign-supplier" && !action.supplierId) {
    return "reassign-supplier requires supplierId";
  }
  if (action.command !== "adjust-price" && action.adjustPct !== undefined) {
    return `adjustPct is not valid for ${action.command}`;
  }
  return null;
}

export function adjustedPrice(price: number, adjustPct: number): number {
  return Math.round(price * (1 + adjustPct / 100) * 100) / 100;
}
