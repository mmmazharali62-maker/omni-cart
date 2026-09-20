// Generic table renderer for admin lists (spec section 14).
export type Column<T> = { header: string; cell: (row: T) => React.ReactNode; className?: string };

export function DataTable<T>({ rows, columns, emptyMessage = "Nothing here yet." }: { rows: T[]; columns: Column<T>[]; emptyMessage?: string }) {
  if (rows.length === 0) {
    return <p className="text-white/50 text-sm py-6 text-center">{emptyMessage}</p>;
  }
  return (
    <table className="w-full text-sm">
      <thead className="text-white/50 text-xs">
        <tr>
          {columns.map((c) => (
            <th key={c.header} className={`text-left py-2 ${c.className ?? ""}`}>{c.header}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, i) => (
          <tr key={i} className="border-t border-white/10">
            {columns.map((c) => (
              <td key={c.header} className="py-3">{c.cell(row)}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
