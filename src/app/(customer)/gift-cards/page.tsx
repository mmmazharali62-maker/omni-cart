import { pageMeta } from "@/lib/seo-meta";
import { GiftCardPicker } from "@/components/gift-card/gift-card-picker";
import { GiftCardBalanceForm } from "@/components/gift-card/gift-card-balance-form";
import { GlassPanel } from "@/components/ui/glass-panel";

export const metadata = pageMeta("Gift Cards", "Omni Cart gift cards - the easy gift for the US and UK.");

export default function GiftCardsPage() {
  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">Gift cards</h1>
      <p className="text-white/50 text-sm mt-1 mb-8">Digital delivery, no fees, no expiry. Valid on everything.</p>
      <GiftCardPicker />
      <div className="mt-10">
        <h2 className="text-xl font-medium mb-4">Check a balance</h2>
        <GiftCardBalanceForm />
        <GlassPanel className="mt-6 p-5 text-sm text-white/60">
          <p>Gift cards can cover the whole order or split with a card. Refunds go back to the gift card first.</p>
        </GlassPanel>
      </div>
    </section>
  );
}
