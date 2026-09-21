import { GlassPanel } from "@/components/ui/glass-panel";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Accessibility", "How Omni Cart stays usable for everyone.");

const COMMITMENTS = [
  ["Standards", "We target WCAG 2.1 AA. Every new page is checked with keyboard navigation and a screen reader before launch."],
  ["Keyboard", "The whole storefront works without a mouse: tab order, focus rings, and skip-to-content are built in."],
  ["Contrast", "Liquid Glass surfaces maintain 4.5:1 text contrast in both dark and light themes."],
  ["Motion", "Reveal animations respect prefers-reduced-motion; nothing flashes or auto-plays."],
  ["Forms", "Every input has a visible label, errors are announced, and no field relies on color alone."],
  ["Images", "Product images carry descriptive alt text; decorative images are marked for screen readers to skip."],
  ["Feedback", "Found a barrier? Email accessibility@omnicart.example.com - we fix confirmed issues within 5 business days."]
] as const;

export default function AccessibilityPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Accessibility</h1>
      <div className="mt-6 space-y-4">
        {COMMITMENTS.map(([title, body]) => (
          <GlassPanel key={title}>
            <h2 className="font-medium">{title}</h2>
            <p className="text-sm text-white/70 mt-2">{body}</p>
          </GlassPanel>
        ))}
      </div>
    </section>
  );
}
