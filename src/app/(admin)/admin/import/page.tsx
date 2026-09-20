import { ImportWizard } from "@/components/admin/ops/import-wizard";

export const metadata = { title: "Import Products | Omni Cart" };

// One-click import hub (spec section 10/26): CJ/AliExpress/Amazon URLs or CSV.
export default function AdminImportPage() {
  return (
    <section className="mx-4 mt-12 max-w-2xl">
      <h1 className="text-3xl font-semibold">Import products</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">
        Paste a supplier product URL for a one-click import, or bring a catalog via CSV. Everything lands as a draft first.
      </p>
      <ImportWizard />
    </section>
  );
}
