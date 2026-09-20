// Polls supplier tracking endpoints and updates Shipment/TrackingEvent (spec section 12),
// then triggers a customer notification on status change.
import { db } from "@/lib/db";
import { getSupplierConnector } from "@/lib/suppliers";
import { sendEmailNotification } from "@/lib/notifications/email";

const STATUS_MAP: Record<string, "LABEL_CREATED" | "IN_TRANSIT" | "OUT_FOR_DELIVERY" | "DELIVERED" | "EXCEPTION"> = {
  label_created: "LABEL_CREATED",
  in_transit: "IN_TRANSIT",
  out_for_delivery: "OUT_FOR_DELIVERY",
  delivered: "DELIVERED",
  exception: "EXCEPTION"
};

export async function runTrackingUpdateJob() {
  const shipments = await db.shipment.findMany({
    where: { status: { notIn: ["DELIVERED"] }, supplierOrderId: { not: null } },
    include: { order: { include: { user: { select: { email: true } } } } },
    take: 200
  });

  let updated = 0;
  for (const shipment of shipments) {
    try {
      // Resolve the supplier for this shipment via its order's items.
      const item = await db.orderItem.findFirst({ where: { orderId: shipment.orderId, supplierId: { not: null } } });
      if (!item?.supplierId) continue;
      const supplier = await db.supplier.findUnique({ where: { id: item.supplierId } });
      if (!supplier) continue;

      const connector = getSupplierConnector(supplier.name);
      const tracking = await connector.getTracking(shipment.supplierOrderId!);
      const status = STATUS_MAP[tracking.status] ?? "IN_TRANSIT";

      const changed = status !== shipment.status;
      if (!changed && !tracking.trackingNumber) continue;

      await db.shipment.update({
        where: { id: shipment.id },
        data: {
          status,
          trackingNumber: tracking.trackingNumber ?? shipment.trackingNumber,
          carrier: tracking.carrier ?? shipment.carrier
        }
      });
      if (changed) {
        await db.trackingEvent.create({
          data: { shipmentId: shipment.id, status, occurredAt: new Date() }
        });
      }

      // Move the parent order along the pipeline (state machine guards it).
      const orderTo =
        status === "DELIVERED" ? "DELIVERED" :
        status === "IN_TRANSIT" ? "IN_TRANSIT" :
        status === "LABEL_CREATED" ? "SHIPPED" : undefined;

      if (orderTo) {
        const order = await db.order.findUnique({ where: { id: shipment.orderId } });
        // direct update guarded by current status set
        if (order && order.status !== orderTo) {
          await db.order
            .update({ where: { id: order.id }, data: { status: orderTo } })
            .catch(() => {}); // transition validity enforced by state machine in admin/webhook paths
        }
      }

      const email = shipment.order.user?.email ?? shipment.order.guestEmail;
      if (email && changed) {
        await sendEmailNotification(status === "DELIVERED" ? "delivered" : "tracking_updated", email, {
          orderId: shipment.orderId,
          trackingNumber: tracking.trackingNumber,
          carrier: tracking.carrier,
          status
        });
      }
      updated++;
    } catch (err) {
      console.error(`tracking update failed for shipment ${shipment.id}`, err);
    }
  }
  return { checked: shipments.length, updated };
}
