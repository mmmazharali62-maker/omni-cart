import { RoleMatrix } from "@/components/admin/ops/role-matrix";
import { ROLE_LABELS } from "@/lib/backoffice/roles";

export const metadata = { title: "Roles & Permissions | Omni Cart" };

// Role matrix (spec section 17): least privilege, fully visible.
export default function AdminRolesPage() {
  return (
    <section className="mx-4 mt-12 max-w-5xl">
      <h1 className="text-3xl font-semibold">Roles &amp; permissions</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">
        {Object.values(ROLE_LABELS).length} roles, least-privilege by default. Changes are audited.
      </p>
      <RoleMatrix />
    </section>
  );
}
