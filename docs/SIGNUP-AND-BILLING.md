# Signup and billing

Get Started during the first-month campaign opens `/wait`. The visitor sets a name, email, and password. The password is stored as a hash. The card at `/wait/WL-……` shows the name and waiting-list id and does not include a QR code. Admin sees the list under Waiting list, with email and id, not the password. Set `NEXT_PUBLIC_WAITING_LIST=false` when the campaign ends and account sign-up should take over.

Get Started on the landing page opens `/sign-up` once `NEXT_PUBLIC_WEB_SIGN_UP_DISABLED=false` and the waiting-list campaign is off.

Website checkout is `POST /billing/checkout` with `{ planCode: "pro" | "business" }`. It stays closed (`503`) until:

- `BILLING_PROVIDER=endpoint`
- `BILLING_CHECKOUT_ENDPOINT` is the payment URL that returns `{ "checkoutUrl": "https://..." }`
- `BILLING_WEBHOOK_SECRET` is set, and the payment side calls `POST /billing/provider/confirm` with `Authorization: Bearer <secret>` and `{ "sessionId" }`

`BILLING_PROVIDER=sandbox` is rejected when `NODE_ENV=production`. Android and Google Play billing hooks are the remaining app-side work at store launch. The admin Payments section and each user record show email, verification contacts, rating counts, and invoices. They do not show database passwords or mail API keys.
