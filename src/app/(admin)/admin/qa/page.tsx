import { db } from "@/lib/db";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

export const metadata = { title: "Q&A Moderation | Omni Cart" };

// Q&A moderation queue (spec section 7): answer + publish.
export default async function AdminQaPage() {
  const questions = await db.qaQuestion.findMany({
    where: { isPublished: false },
    orderBy: { createdAt: "desc" },
    take: 50
  }).catch(() => []);

  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">Q&amp;A moderation</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Answer, then publish. Flagged questions stay private.</p>
      {questions.length === 0 ? (
        <EmptyState title="Queue empty" message="New customer questions appear here for answers." />
      ) : (
        <ul className="space-y-3">
          {questions.map((q) => (
            <li key={q.id} className="glass p-4">
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm font-medium">{q.question}</p>
                <Badge variant="neutral">{q.answer ? "answered" : "pending"}</Badge>
              </div>
              <p className="text-xs text-white/40 mt-1">from {q.askerEmail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
