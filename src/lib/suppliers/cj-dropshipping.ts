import type { SupplierConnector, SupplierProductPayload, SupplierOrderResult } from "./types";

/**
 * CJ Dropshipping connector.
 * Credentials come from process.env.CJ_DROPSHIPPING_* (never hard-coded).
 * Docs: https://developers.cjdropshipping.com/
 * TODO: implement real HTTP calls against CJ's Open API once credentials are provisioned.
 */
export const cjDropshipping: SupplierConnector = {
  name: "CJ_DROPSHIPPING",

  async fetchProduct(supplierProductId: string): Promise<SupplierProductPayload> {
    // TODO: call CJ "Product Query" endpoint with CJ_DROPSHIPPING_API_KEY, map response to SupplierProductPayload.
    throw new Error(`CJ Dropshipping fetchProduct(${supplierProductId}) not implemented yet`);
  },

  async syncProducts(supplierProductIds: string[]): Promise<SupplierProductPayload[]> {
    // TODO: batch-call CJ product query for price/stock/variant changes.
    return [];
  },

  async placeOrder(input): Promise<SupplierOrderResult> {
    // TODO: call CJ "Create Order" endpoint, map Omni Cart order items -> CJ SKUs.
    return { supplierOrderId: "", status: "failed" };
  },

  async getTracking(supplierOrderId: string) {
    // TODO: call CJ "Order Tracking" endpoint.
    return { status: "label_created" as const };
  }
};
