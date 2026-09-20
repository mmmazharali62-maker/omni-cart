import { estimateDuties } from "@/lib/shipping/duties";

// DDU duty warning for big UK orders (spec section 12/17).
export function DutyBanner({ country, subtotalGbp }: { country: string; subtotalGbp: number }) {
  const duty = estimateDuties(country, subtotalGbp);
  if (!duty.note) return null;
  return (
    <div className="glass px-4 py-2 rounded-xl text-xs text-amber-300" role="note">
      {duty.note}
    </div>
  );
}
