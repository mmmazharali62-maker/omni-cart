// Shared test data for E2E specs (spec section 26).
export const SEED = {
  admin: { email: "admin@e2e.omnicart.test", password: "E2eAdmin!Pass1" },
  customer: { email: "customer@e2e.omnicart.test", password: "E2eCustomer!Pass1" },
  guest: { email: "guest@e2e.omnicart.test" },
  products: [
    { slug: "e2e-wireless-earbuds", title: "E2E Wireless Earbuds", price: 29.99, stock: 50, category: "electronics" },
    { slug: "e2e-desk-lamp", title: "E2E Desk Lamp", price: 24.99, stock: 8, category: "home" },
    { slug: "e2e-out-of-stock", title: "E2E Sold Out Mug", price: 9.99, stock: 0, category: "home" }
  ],
  coupon: { code: "E2E10", percent: 10 },
  address: {
    US: { line1: "1 Market St", city: "San Francisco", state: "CA", postalCode: "94105", country: "US" },
    GB: { line1: "1 Oxford St", city: "London", state: "", postalCode: "W1D 1AN", country: "GB" }
  }
} as const;
