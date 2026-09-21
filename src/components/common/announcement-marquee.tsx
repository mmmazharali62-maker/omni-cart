// Liquid Glass announcement bar (spec section 1/2).
export function AnnouncementMarquee({ messages }: { messages: string[] }) {
  if (messages.length === 0) return null;
  return (
    <div className="overflow-hidden glass mx-4 mt-4 rounded-xl" role="marquee" aria-label="Announcements">
      <div className="flex gap-12 px-4 py-2 text-sm animate-[marquee_30s_linear_infinite] whitespace-nowrap">
        {[...messages, ...messages].map((m, i) => (
          <span key={i} className="text-white/70">{m}</span>
        ))}
      </div>
    </div>
  );
}
