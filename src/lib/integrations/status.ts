import type { ProviderDef, ProviderStatus } from "./types";

// Pure status computation (unit-tested): which providers are ready and what's missing.
// settings shape is a minimal projection the caller builds from the DB.
export type SettingsProjection = Record<
  string,
  { savedFields: string[]; isActive: boolean; lastTestedAt?: string | null; lastTestStatus?: string | null; lastTestMessage?: string | null } | undefined
>;

export function computeProviderStatus(def: ProviderDef, settings: SettingsProjection): ProviderStatus {
  const s = settings[def.id];
  const saved = new Set(s?.savedFields ?? []);
  const missing = def.fields.filter((f) => f.required && !saved.has(f.name)).map((f) => f.label);
  return {
    provider: def.id,
    label: def.label,
    category: def.category,
    ready: missing.length === 0,
    active: s?.isActive ?? false,
    missing,
    lastTestedAt: s?.lastTestedAt ?? null,
    lastTestStatus: (s?.lastTestStatus as "ok" | "fail" | null) ?? null,
    lastTestMessage: s?.lastTestMessage ?? null
  };
}

export function computeAllStatuses(defs: ProviderDef[], settings: SettingsProjection): ProviderStatus[] {
  return defs.map((d) => computeProviderStatus(d, settings));
}

export function overallReadiness(statuses: ProviderStatus[]): number {
  if (statuses.length === 0) return 0;
  return Math.round((statuses.filter((s) => s.ready).length / statuses.length) * 100);
}

// Mask a secret for display: keep shape hints, never the middle.
export function maskSecret(value: string): string {
  if (!value) return "";
  if (value.length <= 6) return "•".repeat(Math.max(value.length, 4));
  return `${value.slice(0, 4)}${"•".repeat(Math.min(value.length - 6, 12))}${value.slice(-2)}`;
}
