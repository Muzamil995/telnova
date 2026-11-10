# Stripe Setup Guide (Next.js + Webhooks)

This guide sets up Stripe for 3 plans in this app:

- `monthly` (recurring)
- `yearly` (recurring)
- `lifetime` (one-time)

## 1. Install and Authenticate Stripe CLI

```bash
npm install -g stripe
stripe login
```

## 2. Create Products and Prices in Stripe Dashboard

Open Stripe Dashboard -> Product catalog -> Add product.

Create 3 products/prices:

1. Monthly plan

- Product name: `Telnova Monthly`
- Price model: `Standard pricing`
- Billing period: `Monthly`
- Amount: `9.99 USD`
- Copy resulting `price_...` ID

2. Yearly plan

- Product name: `Telnova Yearly`
- Price model: `Standard pricing`
- Billing period: `Yearly`
- Amount: `99.99 USD`
- Copy resulting `price_...` ID

3. Lifetime plan

- Product name: `Telnova Lifetime`
- Price model: `One time`
- Amount: `199.99 USD`
- Copy resulting `price_...` ID

## 3. Configure Billing Portal

Open Stripe Dashboard -> Billing -> Customer portal.

Enable at minimum:

- Manage payment methods
- View invoices
- Cancel subscriptions
- Update subscriptions (optional)

Save configuration.

## 4. Configure Webhook Endpoint

Create webhook endpoint in Stripe Dashboard:

- URL: `https://www.telnova.ai/api/stripe/webhook`
- API version: latest stable supported in your account

Important:

- Stripe does not accept redirect responses for webhook delivery. Use the exact canonical URL that returns `2xx` directly (no `307`/`308`).

Subscribe to these events:

- `checkout.session.completed`
- `checkout.session.async_payment_succeeded`
- `customer.subscription.created`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `invoice.paid`
- `invoice.payment_failed`

After saving, copy the webhook signing secret (`whsec_...`).

## 5. Local Webhook Testing (Recommended)

Start app:

```bash
npm run dev
```

Forward Stripe webhooks to local Next.js:

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

The CLI prints a temporary signing secret. Use that value for `STRIPE_WEBHOOK_SECRET` in local env.

Trigger sample events:

```bash
stripe trigger checkout.session.completed
stripe trigger customer.subscription.updated
stripe trigger invoice.payment_failed
```

## 6. Checkout Flow in This App

`POST /api/subscription/checkout`

- `monthly` and `yearly` create Stripe Checkout Sessions in `subscription` mode.
- `lifetime` creates Stripe Checkout Session in `payment` mode.

`POST /api/stripe/webhook`

- Verifies Stripe signature.
- Updates `user.subscription` fields based on event type.
- Keeps `plan`, `status`, renewal period, and cancellation state in sync.

`POST /api/subscription/portal`

- Creates Stripe Billing Portal session for paid users.

## 7. Production Checklist

- Use Stripe live keys in production.
- Use public HTTPS URL for webhook endpoint.
- Ensure `NEXT_PUBLIC_APP_URL` matches deployed domain.
- Add all webhook events listed in section 4.
- Verify each plan price ID is correct and active.
- Run a real test checkout for monthly, yearly, and lifetime plans.

## 8. Common Troubleshooting

1. Webhook signature invalid

- Confirm endpoint secret is correct (`STRIPE_WEBHOOK_SECRET`).
- Confirm webhook destination is exactly `/api/stripe/webhook`.

4. Webhook delivery shows `307 Redirect`

- Your endpoint URL is not canonical.
- Example: `https://telnova.ai/api/stripe/webhook` redirects to `https://www.telnova.ai/api/stripe/webhook`.
- Fix Stripe endpoint URL to the final destination that returns `200` directly.

2. Checkout session created but user plan not updated

- Check Stripe webhook delivery logs.
- Confirm subscribed event types include `checkout.session.completed` and subscription events.

3. Billing portal error

- Confirm user has `subscription.stripeCustomerId`.
- Ensure Billing Portal is enabled in Stripe Dashboard.
