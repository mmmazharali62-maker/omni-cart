// Shared admin API guard: session + role check for all /api/admin routes.
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

const ADMIN_ROLES = ["ADMIN", "STORE_MANAGER", "SUPPORT", "OPERATIONS", "FULFILLMENT_MANAGER"];

export async function requireAdmin(roles?: string[]) {
  const session = await getServerSession(authOptions).catch(() => null);
  const role = (session?.user as any)?.role as string | undefined;
  const userId = (session?.user as any)?.id as string | undefined;
  if (!role || !userId) return { ok: false as const, status: 401 };
  const allowed = roles ?? ADMIN_ROLES;
  if (!allowed.includes(role)) return { ok: false as const, status: 403 };
  return { ok: true as const, userId };
}
