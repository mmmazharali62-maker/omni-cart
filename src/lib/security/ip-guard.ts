// IP guard for admin ops endpoints (spec section 17): CIDR allowlists.
export function ipToInt(ip: string): number {
  const parts = ip.split(".").map(Number);
  if (parts.length !== 4 || parts.some((p) => Number.isNaN(p) || p < 0 || p > 255)) return -1;
  return ((parts[0] << 24) | (parts[1] << 16) | (parts[2] << 8) | parts[3]) >>> 0;
}

export function cidrContains(cidr: string, ip: string): boolean {
  const [range, bitsRaw] = cidr.split("/");
  const bits = Number(bitsRaw);
  const rangeInt = ipToInt(range);
  const ipInt = ipToInt(ip);
  if (rangeInt < 0 || ipInt < 0 || !Number.isInteger(bits) || bits < 0 || bits > 32) return false;
  const mask = bits === 0 ? 0 : (0xffffffff << (32 - bits)) >>> 0;
  return (rangeInt & mask) === (ipInt & mask);
}

// Allowlist check; empty allowlist = allow-all (dev mode).
export function isAllowed(allowlist: string[], ip: string): boolean {
  if (allowlist.length === 0) return true;
  return allowlist.some((cidr) => cidrContains(cidr, ip));
}

// Extracts the client IP from x-forwarded-for chains.
export function clientIp(forwardedFor: string | null, fallback: string): string {
  if (!forwardedFor) return fallback;
  return forwardedFor.split(",")[0].trim();
}
