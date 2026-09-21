import { GlassPanel } from "@/components/ui/glass-panel";
import { can, permissionsFor, ROLE_LABELS, type Permission, type Role } from "@/lib/backoffice/roles";

const ALL_PERMISSIONS: Permission[] = [
  "products:write", "products:delete", "orders:read", "orders:write", "returns:decide",
  "customers:read", "customers:write", "integrations:manage", "pricing:write", "audit:read", "flags:manage"
];
const ROLES: Role[] = ["ADMIN", "STORE_MANAGER", "SUPPORT", "CONTENT", "VIEWER"];

// Who can do what (spec section 17): least privilege, visible to admins.
export function RoleMatrix() {
  return (
    <GlassPanel className="p-0 overflow-x-auto">
      <table className="w-full text-sm min-w-[700px]">
        <thead>
          <tr className="border-b border-white/10">
            <th className="p-4 text-left text-white/40">Permission</th>
            {ROLES.map((r) => (
              <th key={r} className="p-4 text-left whitespace-nowrap">{ROLE_LABELS[r]}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {ALL_PERMISSIONS.map((p) => (
            <tr key={p} className="border-t border-white/10">
              <td className="p-4 font-mono text-xs text-white/70">{p}</td>
              {ROLES.map((r) => (
                <td key={r} className="p-4">
                  {can(r, p) ? (
                    <span className="text-emerald-400" aria-label="allowed">✓</span>
                  ) : (
                    <span className="text-white/20" aria-label="not allowed">-</span>
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <p className="p-4 text-xs text-white/40">
        {permissionsFor("VIEWER").length} read-only permission(s) for viewers; admins hold all {ALL_PERMISSIONS.length}.
      </p>
    </GlassPanel>
  );
}
