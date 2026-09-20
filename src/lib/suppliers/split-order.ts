// Order splitting (spec section 11/19): one cart, multiple supplier shipments.
export type SplitInput = {
  orderId: string;
  items: Array<{ itemId: string; supplierId: string; price: number }>;
};

export type SupplierShipment = {
  supplierId: string;
  itemIds: string[];
  subtotal: number;
};

// Group items by supplier; each group becomes one fulfillment + tracking event.
export function splitOrder(order: SplitInput): SupplierShipment[] {
  const groups = new Map<string, SupplierShipment>();
  for (const item of order.items) {
    const existing = groups.get(item.supplierId);
    if (existing) {
      existing.itemIds.push(item.itemId);
      existing.subtotal += item.price;
    } else {
      groups.set(item.supplierId, { supplierId: item.supplierId, itemIds: [item.itemId], subtotal: item.price });
    }
  }
  return [...groups.values()].map((g) => ({ ...g, subtotal: Math.round(g.subtotal * 100) / 100 }));
}

// Customers see one order; we handle N shipments without bothering them.
export function shipmentLabels(splits: SupplierShipment[]): string[] {
  return splits.map((s, i) => `Shipment ${i + 1} of ${splits.length} (${s.itemIds.length} item${s.itemIds.length > 1 ? "s" : ""})`);
}
