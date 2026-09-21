import { FeatureFlagsPanel } from "@/components/admin/ops/feature-flags-panel";
import { DEFAULT_FLAGS } from "@/lib/feature-flags";

export const metadata = { title: "Feature Flags | Omni Cart" };

// Feature flags (spec section 26): instant kill switches.
export default function AdminFeatureFlagsPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Feature flags</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Disable anything, instantly, without a deploy.</p>
      <FeatureFlagsPanel initialFlags={DEFAULT_FLAGS} />
    </section>
  );
}
