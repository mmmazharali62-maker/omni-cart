import { describe, expect, it } from "vitest";
import { passwordFeedback, passwordStrength } from "@/lib/password";

describe("password strength", () => {
  it("scores weak passwords low", () => {
    expect(passwordStrength("abc")).toBe(0);
    expect(passwordStrength("abcdefgh")).toBe(1);
  });
  it("scores strong passwords high", () => {
    expect(passwordStrength("Correct-Horse9!")).toBe(4);
  });
  it("gives actionable feedback", () => {
    expect(passwordFeedback("abc")).toContain("Add an uppercase letter");
    expect(passwordFeedback("Abcdefgh1!")).toHaveLength(0);
  });
});
