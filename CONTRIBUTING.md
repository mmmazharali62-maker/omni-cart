# Contributing to Omni Cart

## Ground rules

- All business logic lives in `src/lib/*` (pure, testable) - pages and API
  routes stay thin and call into it.
- Never hard-code secrets, API keys, or supplier credentials. Everything goes
  through environment variables (see `.env.example`).
- Client-sent prices/totals are never trusted. Always rehydrate from the DB
  (`src/lib/cart/totals.ts` pattern).
- Every state change on an Order goes through the state machine
  (`src/lib/orders/state-machine.ts`). No direct status writes outside it.
- Admin mutations: role check via `requireAdmin()` + audit log entry.

## Testing

- Unit tests live in `test/` (vitest). Run: `npm test`
- Pricing, cart totals, state machine, and validation have coverage - extend
  these when touching the corresponding lib files.

## Commits

Small, focused commits with a clear message. Push to `main` only when the
app builds; feature branches welcome for larger changes.
