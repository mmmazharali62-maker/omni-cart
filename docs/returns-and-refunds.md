# Returns & Refunds (Implementation)

Customer-facing policy lives at `/refund-policy`. This doc covers the system.

## Flow

```
Customer requests (/returns)
      -> status: requested
Admin approves            -> status: approved   (instructions emailed)
Parcel received at WH     -> status: received
Refund issued (Stripe)    -> status: refunded
```

Any pending state can be rejected or (by the customer) cancelled.

## Components

| Piece | Location |
|---|---|
| Eligibility (30-day window, final-sale categories) | `src/lib/returns/policy.ts` |
| Status state machine (legal transitions only) | `src/lib/returns/status.ts` |
| Reason codes + fault attribution | `src/lib/returns/reasons.ts` |
| Return-shipping instructions | `src/lib/returns/labels.ts` |
| Customer pages | `src/app/(customer)/returns/` |
| Admin queue | `src/app/(admin)/admin/returns/` |
| APIs | `src/app/api/returns/`, `src/app/api/admin/returns/` |

## Refund math

- Days 0-14 after delivery: 100% refund.
- Days 15-30: 85% (15% restocking).
- Damaged/wrong item (supplier fault): always 100% + prepaid label.
- Refunds execute through Stripe `refunds.create` with the original charge id.

## Fraud & abuse guards

- One open return per order item.
- Reason codes with supplier-fault attribution feed the supplier health score;
  repeated supplier faults deprioritize that supplier for auto-routing.

## Analytics

Returns per category and reason code appear in the admin analytics page;
`supplier-health` weights defect rate at 20 points.
