// Polls supplier tracking endpoints and updates Shipment/TrackingEvent (spec section 12),
// then triggers a customer notification on status change.
import { db } from "@/lib/db";
import { getSupplierConnector } from "@/lib/suppliers";
import { sendEmailNotification } from "@/lib/notifications/email";

export async function runTrackingUpdateJob() {
  const shipments = await db.shipment.findMany({
    where: { status: { notIn: ["DELIVERED"] } },
    include: { order: { include: { user: true } } }
  });
  for (const shipment of shipments) {
    if (!shipment.supplierOrderId) continue;
    // TODO: figure out which supplier this shipment belongs to and call its connector.
    // const tracking = await connector.getTracking(shipment.supplierOrderId);
    // update Shipment + create TrackingEvent + sendEmailNotification("tracking_updated", ...)
  }
}
