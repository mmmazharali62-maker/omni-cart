// Spec/attribute table on the product page (spec section 3).
export function ProductSpecs({ specs }: { specs: Array<{ label: string; value: string }> }) {
  if (specs.length === 0) return null;
  return (
    <div className="glass p-4">
      <h3 className="text-sm font-medium mb-3">Specifications</h3>
      <table className="w-full text-sm">
        <tbody>
          {specs.map((s) => (
            <tr key={s.label} className="border-t border-white/10 first:border-t-0">
              <td className="py-2 text-white/50 w-1/3">{s.label}</td>
              <td className="py-2">{s.value}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
