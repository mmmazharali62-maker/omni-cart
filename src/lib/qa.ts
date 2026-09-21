// Product Q&A (spec section 7): moderation + ranking rules.
export type Question = {
  id: string; question: string; answer: string | null;
  helpfulCount: number; isPublished: boolean; askerEmail?: string;
};

export function needsModeration(q: Pick<Question, "question">): boolean {
  const qLower = q.question.toLowerCase();
  const banned = [/https?:\/\//, /\b(?:whatsapp|telegram|@[a-z0-9._-]+\.(?:com|net|org))\b/, /\b(?:cheap|discount)\s*code\b/];
  return banned.some((re) => re.test(qLower));
}

// Published Q&A sorts: answered first, then by helpfulness.
export function rankQuestions(questions: Question[]): Question[] {
  return [...questions]
    .filter((q) => q.isPublished)
    .sort((a, b) => {
      if (!!a.answer !== !!b.answer) return a.answer ? -1 : 1;
      return b.helpfulCount - a.helpfulCount;
    });
}

export function anonymizeAsker(askerEmail?: string): string {
  if (!askerEmail || !askerEmail.includes("@")) return "Anonymous";
  const [name] = askerEmail.split("@");
  return `${name.slice(0, 1).toUpperCase()}*** ${name.length > 1 ? name.slice(1, 2) + "." : ""}`;
}
