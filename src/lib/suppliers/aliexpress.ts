import type { SupplierConnector, SupplierProductPayload, SupplierOrderResult } from "./types";

/**
 * AliExpress connector (via AliExpress Dropshipping / Affiliate API).
 * Credentials: ALIEXPRESS_APP_KEY / ALIEXPRESS_APP_SECRET.
 * TODO: implement real signed-request calls once app is approved by AliExpress Open Platform.
 */
export const aliExpress: SupplierConnector = {
  name: "ALIEXPRESS",

  async fetchProduct(supplierProductId: string): Promise<SupplierProductPayload> {
    throw new Error(`AliExpress fetchProduct(${supplierProductId}) not implemented yet`);
  },

  async syncProducts(supplierProductIds: string[]): Promise<SupplierProductPayload[]> {
    return [];
  },

  async placeOrder(input): Promise<SupplierOrderResult> {
    return { supplierOrderId: "", status: "failed" };
  },

  async getTracking(supplierOrderId: string) {
    return { status: "label_created" as const };
  }
};
