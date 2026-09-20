import { describe, expect, it } from "vitest";
import { decryptValue, encryptKeys, encryptValue } from "@/lib/integrations/encrypt";

describe("integrations encryption", () => {
  it("round-trips a secret", () => {
    const enc = encryptValue("sk_live_secret123");
    expect(enc).not.toContain("sk_live");
    expect(decryptValue(enc)).toBe("sk_live_secret123");
  });
  it("produces different ciphertexts per call (random IV)", () => {
    expect(encryptValue("same")).not.toBe(encryptValue("same"));
  });
  it("encrypts a whole keys object", () => {
    const enc = encryptKeys({ apiKey: "abc", token: "xyz" });
    expect(Object.keys(enc)).toEqual(["apiKey", "token"]);
    expect(enc.apiKey).not.toContain("abc");
  });
  it("returns null for tampered payloads", () => {
    const enc = encryptValue("hello");
    expect(decryptValue(enc.slice(0, -4) + "AAAA")).toBeNull();
    expect(decryptValue("garbage")).toBeNull();
  });
});
