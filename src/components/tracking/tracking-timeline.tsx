// Vertical tracking timeline (spec section 19): carrier events + live links.
export type TimelineEvent = { status: string; location?: string | null; occurredAt: string | Date };

export function TrackingTimeline({
  events,
  carrierUrl
}: {
  events: TimelineEvent[];
  carrierUrl?: string | null;
}) {
  return (
    <div>
      {events.length === 0 && <p className="text-sm text-white/50">No tracking events yet - check back soon.</p>}
      <ol className="space-y-0">
        {events.map((e, i) => {
          const latest = i === 0; // events arrive newest-first
          return (
            <li key={i} className="flex gap-3">
              <div className="flex flex-col items-center">
                <span className={`w-3 h-3 rounded-full ${latest ? "bg-brand-500" : "bg-white/20"}`} />
                {i < events.length - 1 && <span className="w-px flex-1 bg-white/10 my-1" />}
              </div>
              <div className="pb-6">
                <p className={`text-sm ${latest ? "font-medium" : "text-white/60"}`}>
                  {e.status.replaceAll("_", " ").toLowerCase()}
                </p>
                <p className="text-xs text-white/40">
                  {new Date(e.occurredAt).toLocaleString()}{e.location ? ` - ${e.location}` : ""}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
      {carrierUrl && (
        <a href={carrierUrl} target="_blank" rel="noreferrer" className="text-sm text-brand-400 hover:underline">
          Track on the carrier's site →
        </a>
      )}
    </div>
  );
}
