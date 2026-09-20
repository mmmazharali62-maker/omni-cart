# Import Runbook

How products get into Omni Cart from each source.

## One-click supplier import

Admin → Import → paste a CJ / AliExpress / Amazon product URL.

Pipeline (all server-side, `src/lib/import/`):
1. **Fetch** the product payload via the supplier API.
2. **Normalize** (`normalize.ts`): clean titles (no "hot sale" junk),
   https-only images, parsed prices, capped variants.
3. **Validate** (`validate.ts`): title >= 5 chars, at least one image,
   positive price. Failures return exact reasons - nothing half-imported.
4. **Margin guard**: imports with less than 15% margin are flagged, not dropped.

Every import lands as **DRAFT** so the storefront never shows raw feed data.

## CSV catalog import

Admin → Import → CSV tab (or `POST /api/admin/import-csv`).

- Required column: `title`. Recognized: `price`/`variant_price`, `stock`/
  `inventory_quantity`, `sku`, `description`, `image` (pipe-separated).
- Quoted cells and embedded commas handled (`src/lib/csv-import.ts`).
- Max 500 rows per run, 1000 parsed - use batches for big catalogs.

## Sync automation (already running)

- Background jobs re-sync stock/prices from suppliers (`src/lib/jobs/`).
- Webhooks (`/api/webhooks/cj`, `/api/webhooks/aliexpress`) record order
  events; token header required once configured.
- Stale syncs (72h+) reduce supplier health, which stops auto-routing.

## Quality rules (do not bypass)

- Never publish without a real image and description.
- Never import below the margin floor - adjust the pricing engine instead.
- Review the Drafts page weekly; stale drafts (30+ days) get archived.
