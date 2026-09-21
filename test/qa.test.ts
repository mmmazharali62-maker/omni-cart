import { describe, expect, it } from "vitest";
import { anonymizeAsker, needsModeration, rankQuestions } from "@/lib/qa";

describe("product Q&A", () => {
  it("flags spam for moderation", () => {
    expect(needsModeration({ question: "buy now at https://spam.example" })).toBe(true);
    expect(needsModeration({ question: "whatsapp me for discounts" })).toBe(true);
    expect(needsModeration({ question: "Does this ship to the UK within a week?" })).toBe(false);
  });
  it("ranks published answers first, then helpfulness", () => {
    const ranked = rankQuestions([
      { id: "1", question: "Q1", answer: null, helpfulCount: 9, isPublished: true },
      { id: "2", question: "Q2", answer: "A", helpfulCount: 2, isPublished: true },
      { id: "3", question: "Q3", answer: "A", helpfulCount: 5, isPublished: true },
      { id: "4", question: "Q4", answer: "A", helpfulCount: 99, isPublished: false }
    ]);
    expect(ranked.map((q) => q.id)).toEqual(["3", "2", "1"]);
  });
  it("anonymizes askers safely", () => {
    expect(anonymizeAsker("jane@example.com")).toMatch(/^J/);
    expect(anonymizeAsker(undefined)).toBe("Anonymous");
    expect(anonymizeAsker("jane@example.com")).not.toContain("@");
  });
});
