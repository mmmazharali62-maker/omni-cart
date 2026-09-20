# Amazon PA-API Setup

Amazon's Product Advertising API provides marketplace lookups and pricing
reference for US (`amazon.com`) and UK (`amazon.co.uk`).

## Get your credentials

1. Join the Amazon Associates program (affiliate-program.amazon.com).
2. PA-API access requires **3 qualifying sales within 180 days** of joining.
   Until then, the integration can save credentials but full lookups will
   wait for approval.
3. Once granted: Associates Central → Tools → **Product Advertising API** →
   add credentials. Copy the **Access key** and **Secret key**.
4. Copy your **Partner tag** (e.g. `yourstore-20` for the US).

## Apply it

Admin → Integrations → Amazon (PA-API): paste the access key, secret key,
partner tag, and choose the marketplace. Save, then **Test connection** -
the test validates the format even before PA-API access is granted.

## Notes

- The partner tag suffix differs by marketplace: `-20` (US), `-21` (UK).
- API calls are throttled (1/sec at the base tier); the app queues lookups.
