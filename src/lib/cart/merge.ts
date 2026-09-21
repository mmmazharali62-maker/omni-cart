// Cart merge on login (spec section 4/6): guest cart joins the user's cart.
export type CartLine = { productId: string; variantId?: string | null; quantity: number };

// Union merge: quantities add for the same product+variant, never overwrite.
export function mergeCarts(userCart: CartLine[], guestCart: CartLine[], maxPerItem = 99): CartLine[] {
  const key = (l: CartLine) => `${l.productId}:${l.variantId ?? "default"}`;
  const merged = new Map<string, CartLine>();
  for (const line of [...userCart, ...guestCart]) {
    const k = key(line);
    const existing = merged.get(k);
    const quantity = Math.min(maxPerItem, (existing?.quantity ?? 0) + line.quantity);
    merged.set(k, { ...line, quantity });
  }
  return [...merged.values()];
}

// Empty guest carts are a no-op.
export function needsMerge(userCart: CartLine[], guestCart: CartLine[]): boolean {
  return guestCart.length > 0 && userCart.length > 0;
}
