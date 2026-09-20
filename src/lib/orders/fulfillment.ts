// Fulfillment pipeline (spec section 7/11): paid order -> supplier order.
// Includes duplicate-order protection: refuses when a supplierOrderId already exists.
import { db } from "@/lib/db";
import { getSupplierConnector } from "@/lib/suppliers";

export async function fulfillOrder(orderId: string) {
  const order = await db.order.findUnique({
    where: { id: orderId },
    include: { items: true, shipments: true }
  });
  if (!order) throw new Error(`Order ${orderId} not found`);
  if (order.status !== "PAID") throw new Error(`Order ${orderId} is not PAID (got ${order.status})`);

  // Duplicate protection: never place a second supplier order if one already exists.
  if (order.shipments.some((s) => s.supplierOrderId)) {
    throw new Error(`Order ${orderId} already has a supplier order - refusing duplicate fulfillment`);
  }

  const itemsBySupplier = new Map<string, Array<{ supplierSku: string; quantity: number }>>();
  for (const item of order.items) {
    if (!item.supplierId) continue; // TODO: warn + admin alert for unmapped items
    const list = itemsBySupplier.get(item.supplierId) ?? [];
    list.push({ supplierSku: item.sku, quantity: item.quantity });
    itemsBySupplier.set(item.supplierId, list);
  }

  const supplierOrders: Array<{ supplierId: string; supplierOrderId: string }> = [];
  for (const [supplierId, items] of itemsBySupplier) {
    const supplier = await db.supplier.findUnique({ where: { id: supplierId } });
    if (!supplier) continue;
    const connector = getSupplierConnector(supplier.name);
    const result = await connector.placeOrder({
      items,
      shippingAddress: order.shippingAddress as Record<string, string>
    });
    if (result.status !== "created") throw new Error(`Supplier ${supplier.name} rejected order ${orderId}`);
    supplierOrders.push({ supplierId, supplierOrderId: result.supplierOrderId });
  }

  for (const so of supplierOrders) {
    await db.shipment.create({
      data: { orderId, supplierOrderId: so.supplierOrderId, status: "LABEL_CREATED" }
    });
  }
  return supplierOrders;
}
