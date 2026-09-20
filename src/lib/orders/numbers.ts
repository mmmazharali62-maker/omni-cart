// Human-friendly order numbers (spec section 8): OC-YYMM-XXXXX with a checksum char.
export function generateOrderNumber(date = new Date(), rand = Math.random): string {
  const y = String(date.getFullYear()).slice(2);
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const serial = Math.floor(rand() * 100000).toString(36).toUpperCase().padStart(4, "0").slice(0, 4);
  const sum = (y + m + serial).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  const check = String.fromCharCode(65 + (sum % 26)); // A-Z checksum
  return `OC-${y}${m}-${serial}${check}`;
}

export function isValidOrderNumber(n: string): boolean {
  if (!/^OC-\d{4}-[0-9A-Z]{5}$/.test(n)) return false;
  const datePart = n.slice(3, 7);  // YYMM
  const serial = n.slice(8, 12);   // 4 chars
  const checkChar = n[12];
  // Same string the generator checksummed: YYMM + serial (no dash).
  const sum = (datePart + serial).split("").reduce((s, c) => s + c.charCodeAt(0), 0);
  return String.fromCharCode(65 + (sum % 26)) === checkChar;
}
