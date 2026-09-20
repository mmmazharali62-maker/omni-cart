import { GlassPanel } from "@/components/ui/glass-panel";
import { digestSeverity, renderDigest } from "@/lib/notifications/digest";
import type { DigestInput } from "@/lib/notifications/digest";

// Yesterday-at-a-glance digest (spec section 14).
export function DigestPreview({ input }: { input: DigestInput }) {
  const { subject, body } = renderDigest(input);
  const severity = digestSeverity(input);
  const tone = severity === "critical" ? "text-red-400" : severity === "warning" ? "text-amber-400" : "text-emerald-400";

  return (
    <GlassPanel className="p-5">
      <div className="flex items-center justify-between">
        <p className="font-medium">{subject}</p>
        <span className={`text-xs uppercase tracking-wide ${tone}`}>{severity}</span>
      </div>
      <pre className="text-xs text-white/60 whitespace-pre-wrap mt-3 font-sans">{body}</pre>
    </GlassPanel>
  );
}
