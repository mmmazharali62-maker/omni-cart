// Role permission matrix (spec section 14/17): least-privilege by default.
export type Role = "ADMIN" | "STORE_MANAGER" | "SUPPORT" | "CONTENT" | "VIEWER";

export type Permission =
  | "products:write" | "products:delete" | "orders:read" | "orders:write"
  | "returns:decide" | "customers:read" | "customers:write"
  | "integrations:manage" | "pricing:write" | "audit:read" | "flags:manage";

const MATRIX: Record<Role, Permission[]> = {
  ADMIN: ["products:write", "products:delete", "orders:read", "orders:write", "returns:decide", "customers:read", "customers:write", "integrations:manage", "pricing:write", "audit:read", "flags:manage"],
  STORE_MANAGER: ["products:write", "orders:read", "orders:write", "returns:decide", "customers:read", "pricing:write"],
  SUPPORT: ["orders:read", "returns:decide", "customers:read", "customers:write"],
  CONTENT: ["products:write"],
  VIEWER: ["orders:read"]
};

export function can(role: string, permission: Permission): boolean {
  return (MATRIX[role as Role] ?? []).includes(permission);
}

export function permissionsFor(role: string): Permission[] {
  return MATRIX[role as Role] ?? [];
}

export const ROLE_LABELS: Record<Role, string> = {
  ADMIN: "Owner / Admin",
  STORE_MANAGER: "Store Manager",
  SUPPORT: "Support Agent",
  CONTENT: "Content Editor",
  VIEWER: "Read-only"
};
