import Image from "next/image";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";

export type ProductCardData = {
  slug: string;
  title: string;
  image: string;
  price: number;
  salePrice?: number;
  currency?: string;
  stock?: number;
};

export function ProductCard({ product }: { product: ProductCardData }) {
  const lowStock = typeof product.stock === "number" && product.stock > 0 && product.stock <= 5;
  return (
    <Link href={`/product/${product.slug}`}>
      <GlassPanel className="p-0 overflow-hidden">
        <div className="relative aspect-square">
          <Image
            src={product.image}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
            quality={75}
            className="object-cover"
          />
          {lowStock && (
            <span className="absolute top-2 left-2 text-xs bg-destructive text-white px-2 py-1 rounded-full">
              Only {product.stock} left
            </span>
          )}
        </div>
        <div className="p-4">
          <p className="text-sm text-white/90 line-clamp-2">{product.title}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="font-semibold">
              {formatMoney(product.salePrice ?? product.price, product.currency ?? "USD")}
            </span>
            {product.salePrice && (
              <span className="text-white/40 line-through text-sm">
                {formatMoney(product.price, product.currency ?? "USD")}
              </span>
            )}
          </div>
        </div>
      </GlassPanel>
    </Link>
  );
}
