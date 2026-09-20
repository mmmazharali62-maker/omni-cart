import { ProductGridSkeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="mx-4 mt-12">
      <div className="h-8 w-48 rounded-lg bg-white/10 animate-pulse mb-8" />
      <ProductGridSkeleton />
    </div>
  );
}
