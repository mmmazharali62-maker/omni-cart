// Shared contract every supplier connector (CJ, AliExpress, Amazon) implements.
// This is the seam that makes "add a new supplier later" (spec section 8/33) cheap.

export type SupplierProductPayload = {
  supplierProductId: string;
  supplierSku: string;
  title: string;
  description: string;
  images: string[];
  cost: number;
  currency: string;
  variants: Array<{
    sku: string;
    options: Record<string, string>;
    price: number;
    stock: number;
  }>;
  shipping?: { estimatedDaysMin?: number; estimatedDaysMax?: number; cost?: number };
};

export type SupplierOrderResult = {
  supplierOrderId: string;
  status: "created" | "failed";
  raw?: unknown;
};

export interface SupplierConnector {
  name: "CJ_DROPSHIPPING" | "ALIEXPRESS" | "AMAZON";
  /** One-click import: fetch a single product's full details by its supplier product id/URL. */
  fetchProduct(supplierProductId: string): Promise<SupplierProductPayload>;
  /** Periodic sync: price, stock, variant and availability changes for already-imported products. */
  syncProducts(supplierProductIds: string[]): Promise<SupplierProductPayload[]>;
  /** Push a paid Omni Cart order to the supplier for fulfillment. */
  placeOrder(input: {
    items: Array<{ supplierSku: string; quantity: number }>;
    shippingAddress: Record<string, string>;
  }): Promise<SupplierOrderResult>;
  /** Poll or receive tracking info for a previously placed supplier order. */
  getTracking(supplierOrderId: string): Promise<{
    trackingNumber?: string;
    carrier?: string;
    status: "label_created" | "in_transit" | "out_for_delivery" | "delivered" | "exception";
  }>;
}
