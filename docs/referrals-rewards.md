# Referrals & Rewards

## Loyalty (points + tiers)

- 1 point per $1 of delivered orders (guest orders don't count until claimed).
- Tiers: bronze < 250, silver 250+, gold 1000+, platinum 2500+.
- Perks scale up (see `src/lib/loyalty.ts`); platinum gets early deal access.

## Referrals

- Codes: `REF-XXXXXXXX` (readable alphabet, no I/O/0/1).
- Friend: $5 off their first order of $15+.
- Referrer: $5 credit when the friend's order **delivers** - not at purchase.
- One reward per referee email, ever (`alreadyReferred`).

### Where things live

| Piece | Location |
|---|---|
| Code + eligibility logic | `src/lib/referrals.ts` |
| Reward trigger | fires on DELIVERED webhook/job processing |
| API | `POST /api/referrals` (issue/claim code) |
| Pages | `/rewards` (customer), cards in `src/components/referral/` |

## Rules of engagement

- Self-referral checks: referee email can't match the referrer's account email.
- Credit is store credit (gift-card style), not cash.
- Abusive patterns (mass disposable emails) freeze the referrer's code.

## Gift cards (adjacent)

Sold at `/gift-cards` in $25-$500 denominations; split-payment math in
`src/lib/money-split.ts`; refunds restore gift-card balance first.
