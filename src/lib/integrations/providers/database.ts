import { db } from "@/lib/db";
import type { TestResult } from "../types";

// Database connectivity test.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  // A stored URL can't hot-swap Prisma's connection (that needs a restart),
  // but we can still verify it points at a live Postgres.
  const url = keys.url ?? process.env.DATABASE_URL;
  if (!url) return { ok: false, message: "No DATABASE_URL saved or set in the environment." };
  if (!/^postgres(ql)?:\/\//.test(url)) return { ok: false, message: "That doesn't look like a Postgres URL (must start with postgres://)." };
  try {
    await db.$queryRaw`SELECT 1`;
    return { ok: true, message: "App database reachable." };
  } catch {
    return { ok: false, message: "App database unreachable - check the URL and run migrations." };
  }
}
