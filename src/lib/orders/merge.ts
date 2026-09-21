// Guest order merge (spec section 6/8): claim orders after signup/login.
export type MergeableOrder = {
  id: string; userId: string | null; guestEmail: string | null;
  status: string; createdAt: string | Date;
};

// Orders placed as a guest with this email can be claimed by the account.
export function claimableOrders(orders: MergeableOrder[], accountEmail: string): MergeableOrder[] {
  const email = accountEmail.toLowerCase();
  return orders.filter(
    (o) => o.userId === null && o.guestEmail?.toLowerCase() === email
  );
}

// Never merge orders that already belong to someone else.
export function canMerge(order: MergeableOrder, accountEmail: string): boolean {
  return order.userId === null && order.guestEmail?.toLowerCase() === accountEmail.toLowerCase();
}

// Delivered/old orders still get merged - history belongs to the account.
export function mergePriority(orders: MergeableOrder[]): MergeableOrder[] {
  return [...orders].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}
