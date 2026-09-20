export type Money = number;

export type CartLine = {
  variantId: string;
  productId: string;
  title: string;
  sku: string;
  unitPrice: Money;
  quantity: number;
  image?: string;
};

export type CartTotals = {
  subtotal: Money;
  discountTotal: Money;
  shippingTotal: Money;
  taxTotal: Money;
  grandTotal: Money;
};
