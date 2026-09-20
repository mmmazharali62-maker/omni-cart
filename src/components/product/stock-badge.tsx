import { Badge } from "@/components/ui/badge";

// Stock status badge (spec section 3).
export function StockBadge({ stock }: { stock: number }) {
  if (stock <= 0) return <Badge variant="danger">Out of stock</Badge>;
  if (stock <= 5) return <Badge variant="warning">Only {stock} left</Badge>;
  return <Badge variant="success">In stock</Badge>;
}
