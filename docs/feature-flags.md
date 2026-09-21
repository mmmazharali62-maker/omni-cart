# Feature Flags

Instant kill switches and gradual rollouts - no deploys needed.

## Current flags

| Key | What | Default |
|---|---|---|
| `compare-mode` | Product comparison tray | on, 100% |
| `referrals` | Referral program | on, 100% |
| `bundles` | Buy-together bundles | on, 50% beta |
| `new-checkout` | One-page checkout rewrite | off, staff-only |

## How they work

- **Storage**: `IntegrationSetting` rows (provider `feature-flags`) override the defaults in `src/lib/feature-flags.ts`; fall back to defaults when unset.
- **Rollout**: `rolloutSlot(visitorId)` gives each visitor a stable 1-100 slot; enabled iff `slot <= rolloutPct`. Same visitor = same experience, every visit.
- **Staff audience**: flags marked `staff` never enable for the public - they require the internal override.
- **Toggle**: Admin → Feature Flags page, or `PATCH /api/admin/feature-flags` (ADMIN only, audited).

## Client-side

```tsx
import { useVisitorId } from "@/hooks/use-visitor-id";
import { isEnabled, rolloutSlot } from "@/lib/feature-flags";
const slot = rolloutSlot(visitorId ?? "v-anon");
const showBundles = isEnabled(flags, "bundles", slot);
```

## Rules

- A flag lives max 60 days: ship it or kill it - no zombie flags.
- Flags gate *presentation*, not *data*: business rules stay in the engine.
- Server checks the same flags as the client - never trust the client alone.
