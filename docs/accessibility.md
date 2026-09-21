# Accessibility Guide

Target: **WCAG 2.1 AA**. The public statement lives at `/accessibility`.

## What's already built in

| Feature | Where |
|---|---|
| Visible labels on every input | All forms (`AddressForm`, `ReviewForm`, Q&A...) |
| aria-labels on icon-only buttons | `MiniCart`, `QuantityInput`, `BackToTop`, `ThemeToggle` |
| Roles + aria-current on nav | `AccountNav`, admin sidebar |
| Focus states | `focus-visible:outline-none focus-visible:ring-2` on all interactive elements |
| Reduced motion | Reveal animations use transform/opacity only; wrap with `prefers-reduced-motion` |
| Screen-reader text | `sr-only` spans for errors and status |
| Keyboard paths | Modals (cookie consent, exit intent) dismissible via focus + Esc handlers |
| 4.5:1 contrast | Liquid Glass tokens in both themes |
| Skip link | (add on layout if missing - top of `<body>`, `href="#main"`) |

## Review checklist (per new page)

1. Tab through: no traps, logical order, visible focus.
2. Every input has a label; errors are text, not just red borders.
3. Buttons say what they do ("Subscribe", not an icon alone).
4. Images: alt text or empty alt + aria-hidden when decorative.
5. Test at 200% zoom - no clipped controls.
6. VoiceOver/NVDA pass on the primary flow.

## Known gaps

- Color-only sale badges also include text ("On sale").
- Charts (price history) carry aria-labels with the data range.

Report barriers: accessibility@omnicart.example.com - 5 business-day fix SLA.
