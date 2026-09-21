// Sequential invoice numbers (spec section 17): INV-YYYYMM-#####.
// Not for order ids - this is the accounting series, issued at payment time.
export function formatInvoiceNumber(year: number, month: number, sequence: number): string {
  return `INV-${year}${String(month).padStart(2, "0")}-${String(sequence).padStart(5, "0")}`;
}

export function isValidInvoiceNumber(n: string): boolean {
  return /^INV-\d{6}-\d{5}$/.test(n);
}

export function parseInvoiceNumber(n: string): { year: number; month: number; sequence: number } | null {
  if (!isValidInvoiceNumber(n)) return null;
  const [year, month, sequence] = [n.slice(4, 8), n.slice(8, 10), n.slice(11)];
  return { year: Number(year), month: Number(month), sequence: Number(sequence) };
}

// Sequence resets each month, ascends within it.
export function nextSequence(existingThisMonth: string[]): number {
  return existingThisMonth.reduce((max, n) => {
    const parsed = parseInvoiceNumber(n);
    return parsed ? Math.max(max, parsed.sequence + 1) : max;
  }, 1);
}
