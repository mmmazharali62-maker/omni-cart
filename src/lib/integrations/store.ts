import { db } from "@/lib/db";
import { decryptKeys, encryptKeys } from "./encrypt";
import { getProviderDef } from "./catalog";

// DB-backed credential store. Env vars still win (envFallback), so this is
// purely additive: nothing breaks before keys are entered.
export type StoredProvider = {
  provider: string;
  isActive: boolean;
  keys: Record<string, string | null>; // decrypted, server-side only
  lastTestedAt: Date | null;
  lastTestStatus: string | null;
  lastTestMessage: string | null;
};

export async function getStoredProvider(providerId: string): Promise<StoredProvider | null> {
  if (!getProviderDef(providerId)) return null;
  const row = await db.integrationSetting.findUnique({ where: { provider: providerId } }).catch(() => null);
  if (!row) return null;
  const keys = row.keys && typeof row.keys === "object" ? decryptKeys(row.keys as Record<string, string>) : {};
  return {
    provider: providerId,
    isActive: row.isActive,
    keys,
    lastTestedAt: row.lastTestedAt,
    lastTestStatus: row.lastTestStatus,
    lastTestMessage: row.lastTestMessage
  };
}

export async function saveProviderKeys(
  providerId: string,
  keys: Record<string, string>,
  updatedBy: string
): Promise<void> {
  const encrypted = encryptKeys(keys);
  await db.integrationSetting.upsert({
    where: { provider: providerId },
    create: { provider: providerId, keys: encrypted, updatedBy },
    update: { keys: encrypted, updatedBy, updatedAt: new Date() }
  });
}

export async function clearProvider(providerId: string): Promise<void> {
  await db.integrationSetting.deleteMany({ where: { provider: providerId } }).catch(() => null);
}

export async function markTested(providerId: string, ok: boolean, message: string): Promise<void> {
  await db.integrationSetting.upsert({
    where: { provider: providerId },
    create: {
      provider: providerId,
      keys: {},
      lastTestedAt: new Date(),
      lastTestStatus: ok ? "ok" : "fail",
      lastTestMessage: message.slice(0, 500)
    },
    update: { lastTestedAt: new Date(), lastTestStatus: ok ? "ok" : "fail", lastTestMessage: message.slice(0, 500) }
  });
}

// Resolved config for a provider: stored keys merged under env fallback.
export async function resolveProviderConfig(providerId: string): Promise<Record<string, string>> {
  const def = getProviderDef(providerId);
  const stored = await getStoredProvider(providerId);
  const resolved: Record<string, string> = {};
  for (const field of def?.fields ?? []) {
    const envName = def?.envFallback?.[field.name];
    const envValue = envName ? process.env[envName] : undefined;
    const storedValue = stored?.keys[field.name] ?? undefined;
    const value = envValue || (storedValue ?? undefined);
    if (value) resolved[field.name] = value;
  }
  return resolved;
}
