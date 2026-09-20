# Gift Cards

## How they work

- Codes look like `OMNI-ABCD-EFGH-JKLM` (no I/0/1/O - easy to read out loud).
- Denominations: $25 / $50 / $100 / $250, delivered by email as a code.
- No fees, no expiry (optional expiry supported), valid on everything.
- Currency: sold in USD (UK gets GBP when the market toggle ships it).

## Split payments

A gift card can cover part of an order; the rest goes to the card:

```
total $50 + $20 gift card -> $20 from gift card, $30 charged
```

Math lives in `src/lib/money-split.ts` - never charged more than the total.

## Refunds

Refund money returns to the gift card first, then the original card
(`refundAllocation`). This matches customer expectations and Stripe rules.

## Where things live

| Piece | Location |
|---|---|
| Code generation + redemption rules | `src/lib/gift-cards.ts` |
| Purchase + redeem API | `src/app/api/gift-cards/` |
| Storefront page | `/gift-cards` |
| Checkout hook | `src/hooks/use-gift-card.ts` |
| DB model | `GiftCard` (prisma/schema.prisma) |

## Anti-abuse

- Balance checks are rate-limited like login (`src/lib/rate-limit.ts`).
- Codes are unique (db constraint); guessing is 36^12 - impractical.
- Admin can deactivate a card without deleting history.
