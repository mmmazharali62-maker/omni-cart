import { cn } from "@/lib/utils";

// Base Liquid Glass surface. Every card/nav/modal in Omni Cart composes this
// instead of redefining blur/border/shadow inline (spec section 25).
export function GlassPanel({
  className,
  children
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return <div className={cn("glass glass-hover p-6", className)}>{children}</div>;
}
