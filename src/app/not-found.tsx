import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="mx-4 mt-24 text-center">
      <p className="text-6xl font-semibold text-white/20">404</p>
      <h1 className="text-2xl font-semibold mt-4">Page not found</h1>
      <p className="text-white/60 text-sm mt-2">The page or product you're looking for doesn't exist.</p>
      <Link href="/shop" className="inline-block mt-8"><Button variant="primary">Back to Shop</Button></Link>
    </section>
  );
}
