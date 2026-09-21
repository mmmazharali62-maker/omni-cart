import { EmptyState } from "@/components/ui/empty-state";
import { anonymizeAsker, rankQuestions, type Question } from "@/lib/qa";

// Published Q&A list (spec section 7): answered first.
export function QaList({ questions }: { questions: Array<Question & { askerEmail?: string }> }) {
  const ranked = rankQuestions(questions);
  if (ranked.length === 0) {
    return <EmptyState title="No questions yet" message="Be the first to ask about this product." />;
  }
  return (
    <ul className="space-y-3">
      {ranked.map((q) => (
        <li key={q.id} className="glass p-4">
          <p className="text-sm font-medium">Q: {q.question}</p>
          {q.answer ? (
            <p className="text-sm text-white/70 mt-2">A: {q.answer}</p>
          ) : (
            <p className="text-xs text-white/40 mt-2">Awaiting answer - we reply within 1 business day.</p>
          )}
          <p className="text-xs text-white/40 mt-2">
            Asked by {anonymizeAsker(q.askerEmail)}
            {q.helpfulCount > 0 && ` - ${q.helpfulCount} found this helpful`}
          </p>
        </li>
      ))}
    </ul>
  );
}
