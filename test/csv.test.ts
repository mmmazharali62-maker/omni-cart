import { describe, expect, it } from "vitest";
import { toCsv } from "@/lib/export/csv";

describe("toCsv", () => {
  it("renders headers and rows", () => {
    const csv = toCsv([{ a: 1, b: "x" }], [
      { header: "A", value: (r: { a: number }) => r.a },
      { header: "B", value: (r: { b: string }) => r.b }
    ]);
    expect(csv).toBe("A,B\n1,x");
  });
  it("escapes quotes, commas, newlines", () => {
    const csv = toCsv([{ v: 'he said "hi", ok' }], [{ header: "V", value: (r: { v: string }) => r.v }]);
    expect(csv).toBe('V\n"he said ""hi"", ok"');
  });
  it("renders null/undefined as empty cells", () => {
    const csv = toCsv([{ v: null }], [{ header: "V", value: (r: { v: string | null }) => r.v }]);
    expect(csv).toBe("V\n");
  });
});
