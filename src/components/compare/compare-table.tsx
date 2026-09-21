import Link from "next/link";
import { compareRows, cheapestInStock, type CompareProduct } from "@/lib/compare";
import { GlassPanel } from "@/components/ui/glass-panel";

// Side-by-side comparison table (spec section 3).
export function CompareTable({ products }: { products: CompareProduct[] }) {
  const { headers, rows } = compareRows(products);
  const cheapest = cheapestInStock(products);

  return (
    <GlassPanel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[600px]">
        <thead>
          <tr>
            <th className="p-4 text-left text-white/40 w-40">Feature</th>
            {products.map((p) => (
              <th key={p.id} className="p-4 text-left">
                <Link href={`/product/${p.slug}`} className="font-medium hover:text-brand-400">
                  {p.title}
                </Link>
                {p.id === cheapest && <span className="block text-xs text-emerald-400 mt-1">Best price in stock</span>}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.label} className="border-t border-white/10">
              <td className="p-4 text-white/50">{row.label}</td>
              {row.values.map((v, i) => (
                <td key={i} className="p-4">{v ?? "-"}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </GlassPanel>
  );
}
