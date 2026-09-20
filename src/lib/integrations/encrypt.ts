import crypto from "crypto";

// AES-256-GCM encryption for stored credentials. The master key comes from
// INTEGRATIONS_MASTER_KEY or NEXTAUTH_SECRET; a dev-only fallback keeps local
// runs working but production must set one of those env vars.
function masterKey(): Buffer {
  const secret = process.env.INTEGRATIONS_MASTER_KEY ?? process.env.NEXTAUTH_SECRET ?? "omni-cart-dev-only-key";
  return crypto.scryptSync(secret, "omni-cart-integrations", 32);
}

export function encryptValue(plain: string): string {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", masterKey(), iv);
  const enc = Buffer.concat([cipher.update(plain, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [iv.toString("base64"), tag.toString("base64"), enc.toString("base64")].join(".");
}

export function decryptValue(payload: string): string | null {
  try {
    const [ivB64, tagB64, dataB64] = payload.split(".");
    const decipher = crypto.createDecipheriv("aes-256-gcm", masterKey(), Buffer.from(ivB64, "base64"));
    decipher.setAuthTag(Buffer.from(tagB64, "base64"));
    return Buffer.concat([decipher.update(Buffer.from(dataB64, "base64")), decipher.final()]).toString("utf8");
  } catch {
    return null; // tampered or wrong master key
  }
}

export function encryptKeys(keys: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(keys)) out[k] = encryptValue(v);
  return out;
}

export function decryptKeys(keys: Record<string, string>): Record<string, string | null> {
  const out: Record<string, string | null> = {};
  for (const [k, v] of Object.entries(keys)) out[k] = decryptValue(v);
  return out;
}
