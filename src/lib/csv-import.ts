// CSV catalog import (spec section 10): small, forgiving parser with a header map.
export type CsvRow = Record<string, string>;

export function parseCsv(text: string, maxRows = 1000): { rows: CsvRow[]; errors: string[] } {
  const errors: string[] = [];
  const lines = text.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) return { rows: [], errors: ["File is empty"] };
  if (lines.length > maxRows + 1) errors.push(`Only the first ${maxRows} rows will be imported`);

  const splitLine = (line: string) => {
    const cells: string[] = [];
    let cell = "";
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        if (inQuotes && line[i + 1] === '"') { cell += '"'; i++; }
        else inQuotes = !inQuotes;
      } else if (ch === "," && !inQuotes) {
        cells.push(cell); cell = "";
      } else cell += ch;
    }
    cells.push(cell);
    return cells.map((c) => c.trim());
  };

  const headers = splitLine(lines[0]).map((h) => h.toLowerCase().replace(/[^a-z0-9]+/g, "_"));
  if (headers.some((h) => h === "")) errors.push("Empty column header found");
  if (!headers.includes("title")) errors.push("A 'title' column is required");

  const rows: CsvRow[] = [];
  for (const line of lines.slice(1, maxRows + 1)) {
    const cells = splitLine(line);
    const row: CsvRow = {};
    headers.forEach((h, i) => { row[h] = cells[i] ?? ""; });
    rows.push(row);
  }
  return { rows, errors };
}

// Map a Shopify/Amazon-style export onto our fields.
export function normalizeRow(rawRow: CsvRow): { title: string; price: number | null; stock: number; sku?: string } {
  // Accept both our lowercased headers and raw Shopify/Amazon-style exports.
  const row: CsvRow = {};
  for (const [k, v] of Object.entries(rawRow)) {
    row[k.toLowerCase().replace(/[^a-z0-9]+/g, "_")] = v;
  }
  const priceRaw = row.price || row.sale_price || row.variant_price || "";
  const num = parseFloat(priceRaw.replace(/[^0-9.]/g, ""));
  return {
    title: (row.title || row.name || "").trim(),
    price: Number.isFinite(num) ? num : null,
    stock: Math.max(0, parseInt(row.stock || row.inventory_quantity || "0", 10) || 0),
    sku: row.sku || row.variant_sku || undefined
  };
}
