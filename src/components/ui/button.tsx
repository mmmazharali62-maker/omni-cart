import { cn } from "@/lib/utils";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "glass" | "ghost";

export function Button({
  variant = "primary",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant }) {
  const styles: Record<Variant, string> = {
    primary: "bg-brand-600 hover:bg-brand-800 text-white shadow-glass",
    glass: "glass glass-hover text-white",
    ghost: "bg-transparent hover:bg-white/10 text-white"
  };
  return (
    <button
      className={cn(
        "px-5 py-2.5 rounded-glass font-medium transition-colors",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}
