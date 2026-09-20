import type { TestResult } from "../types";

// Amazon PA-API access is granted after 3 qualifying sales; until then we
// validate the shape so the owner knows exactly what to paste later.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const accessKey = keys.accessKey ?? process.env.AMAZON_ACCESS_KEY;
  const secretKey = keys.secretKey ?? process.env.AMAZON_SECRET_KEY;
  const partnerTag = keys.partnerTag ?? process.env.AMAZON_PARTNER_TAG;
  const marketplace = keys.marketplace ?? "US";

  const missing: string[] = [];
  if (!accessKey) missing.push("access key");
  if (!secretKey) missing.push("secret key");
  if (!partnerTag) missing.push("partner tag");
  if (missing.length) return { ok: false, message: `Missing: ${missing.join(", ")}.` };

  if (accessKey.length !== 20) return { ok: false, message: "Amazon access keys are 20 characters - re-copy it from Seller Central." };
  if (!/^[a-z0-9-]+-\d{2}$/.test(partnerTag)) return { ok: false, message: "Partner tags look like yourstore-20 (US) or yourstore-21 (UK)." };
  return { ok: true, message: `Credentials look valid for the ${marketplace} marketplace. PA-API calls will confirm access once granted.` };
}
