// Back-in-stock notification (spec section 20): fired by the inventory-sync job
// when a watched variant goes from 0 to >0 stock.
export function renderBackInStock(data: { productTitle: string; slug: string; variant?: string; price?: string }) {
  return {
    subject: `${data.productTitle} is back in stock!`,
    body: `Good news - ${data.productTitle}${data.variant ? ` (${data.variant})` : ""} is available again${
      data.price ? ` for ${data.price}` : ""
    }. Grab it before it sells out: /product/${data.slug}`
  };
}
