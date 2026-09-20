import type { SupplierConnector, SupplierProductPayload, SupplierOrderResult } from "./types";

/**
 * Amazon-related sourcing connector, only where legally/contractually supported
 * (spec section 8). Uses Amazon Selling Partner API credentials.
 * TODO: confirm which Amazon sourcing model (SP-API catalog + your own fulfillment
 * vs. a compliant reseller workflow) before implementing calls - Amazon does not
 * offer a general-purpose "dropship from Amazon" API.
 */
export const amazon: SupplierConnector = {
  name: "AMAZON",

  async fetchProduct(supplierProductId: string): Promise<SupplierProductPayload> {
    throw new Error(`Amazon fetchProduct(${supplierProductId}) not implemented yet`);
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
