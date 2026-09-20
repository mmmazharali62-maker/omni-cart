// Device fingerprinting for fraud review context (spec section 17).
// Hashed hints only - never store raw fingerprint payloads.
export type DeviceHints = {
  userAgent: string; language: string; timezone: string;
  screenWidth?: number; screenHeight?: number;
};

export function fingerprint(hints: DeviceHints): string {
  const raw = [hints.userAgent, hints.language, hints.timezone, hints.screenWidth ?? 0, hints.screenHeight ?? 0].join("|");
  let h1 = 0x811c9dc5, h2 = 0x1000193;
  for (let i = 0; i < raw.length; i++) {
    h1 = ((h1 ^ raw.charCodeAt(i)) * 0x01000193) >>> 0;
    h2 = ((h2 + raw.charCodeAt(i) * (i + 7)) * 0x85ebca6b) >>> 0;
  }
  return `fp_${h1.toString(36)}${h2.toString(36)}`;
}

// Same fingerprint seen from many accounts = shared device (review hint).
export function isSharedDevice(accountCount: number): boolean {
  return accountCount >= 3;
}

// Mismatch between account country and checkout country.
export function countryMismatch(accountCountry: string, checkoutCountry: string): boolean {
  if (!accountCountry || !checkoutCountry) return false;
  return accountCountry !== checkoutCountry && !(accountCountry === "US" && checkoutCountry === "US");
}
