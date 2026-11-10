This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Environment Variables

Create a `.env.local` file in the project root and add:

```bash
JWT_SECRET=your-jwt-secret
OPENAI_API_KEY=your-openai-api-key
OPENAI_MODEL=gpt-4.1-mini
RESEND_API_KEY=your-resend-api-key
EMAIL_FROM=onboarding@resend.dev
NEXT_PUBLIC_APP_URL=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
STRIPE_MONTHLY_PRICE_ID=price_monthly_xxx
STRIPE_YEARLY_PRICE_ID=price_yearly_xxx
STRIPE_LIFETIME_PRICE_ID=price_lifetime_xxx
STRIPE_API_VERSION=2025-02-24.acacia
STRIPE_CURRENCY=usd
```

Notes:

- `OPENAI_API_KEY` is required for the dashboard support chat.
- `OPENAI_MODEL` is optional; defaults to `gpt-4.1-mini`.
- `RESEND_API_KEY` is required for signup verification and password reset emails.
- `NEXT_PUBLIC_APP_URL` is used to build absolute links in password reset emails.
- `STRIPE_SECRET_KEY` must be server-side only.
- `STRIPE_WEBHOOK_SECRET` is the Stripe endpoint signing secret (`whsec_...`).
- Price IDs must match your Stripe product prices for monthly, yearly, and lifetime.
- Keep API keys server-side only and never expose them in client components.

## Stripe Setup

For complete Stripe setup (products, prices, webhooks, local testing, and troubleshooting), see:

- `docs/stripe_setup.md`

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
