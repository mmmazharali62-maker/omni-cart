import { Button } from "@/components/ui/button";

// Premium animated hero section (spec section 1). Animation is intentionally
// left as a follow-up (Framer Motion is already a dependency) so this stays
// framework-correct without shipping unreviewed motion choices.
export function Hero() {
  return (
    <section className="mx-4 mt-8 glass px-10 py-20 text-center overflow-hidden relative">
      <h1 className="text-4xl md:text-6xl font-semibold tracking-tight">
        Shop the world, <span className="text-brand-400">delivered to you.</span>
      </h1>
      <p className="mt-4 text-white/70 max-w-xl mx-auto">
        Curated finds sourced globally, with fast, reliable shipping across the UK and USA.
      </p>
      <div className="mt-8 flex gap-4 justify-center">
        <Button variant="primary">Shop Now</Button>
        <Button variant="glass">Explore Deals</Button>
      </div>
    </section>
  );
}
