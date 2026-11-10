import Stripe from "stripe";

const STRIPE_API_VERSION =
  process.env.STRIPE_API_VERSION || "2025-02-24.acacia";

let stripeClient;

export function getStripeClient() {
  if (stripeClient) {
    return stripeClient;
  }

  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error("Missing STRIPE_SECRET_KEY environment variable");
  }

  stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY, {
    apiVersion: STRIPE_API_VERSION,
  });

  return stripeClient;
}

export function getStripeConfig() {
  return {
    monthlyPriceId: process.env.STRIPE_MONTHLY_PRICE_ID,
    yearlyPriceId: process.env.STRIPE_YEARLY_PRICE_ID,
    lifetimePriceId: process.env.STRIPE_LIFETIME_PRICE_ID,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    currency: process.env.STRIPE_CURRENCY || "usd",
  };
}

export function getStripePlanConfig(plan) {
  const config = getStripeConfig();

  const planMap = {
    monthly: {
      mode: "subscription",
      priceId: config.monthlyPriceId,
    },
    yearly: {
      mode: "subscription",
      priceId: config.yearlyPriceId,
    },
    lifetime: {
      mode: "payment",
      priceId: config.lifetimePriceId,
    },
  };

  return planMap[plan] || null;
}

export function getPlanFromStripePriceId(priceId) {
  const config = getStripeConfig();

  if (priceId === config.monthlyPriceId) {
    return "monthly";
  }

  if (priceId === config.yearlyPriceId) {
    return "yearly";
  }

  if (priceId === config.lifetimePriceId) {
    return "lifetime";
  }

  return null;
}

export function mapStripeSubscriptionStatus(status) {
  switch (String(status || "").toLowerCase()) {
    case "active":
    case "trialing":
      return "active";
    case "past_due":
      return "past_due";
    case "unpaid":
      return "unpaid";
    case "canceled":
      return "canceled";
    case "incomplete":
    case "incomplete_expired":
    case "paused":
      return "inactive";
    default:
      return "inactive";
  }
}

export function toDateOrNull(unixSeconds) {
  if (!unixSeconds) {
    return null;
  }

  return new Date(unixSeconds * 1000);
}

export function normalizeSubscriptionFromStripe({
  stripeCustomerId,
  stripeSubscriptionId,
  stripePriceId,
  status,
  plan,
  currentPeriodStart,
  currentPeriodEnd,
  cancelAtPeriodEnd,
  stripeEventType,
}) {
  return {
    stripeCustomerId: stripeCustomerId || null,
    stripeSubscriptionId: stripeSubscriptionId || null,
    stripePriceId: stripePriceId || null,
    status: status || "inactive",
    plan: plan || "free",
    currentPeriodStart: currentPeriodStart || null,
    currentPeriodEnd: currentPeriodEnd || null,
    cancelAtPeriodEnd: Boolean(cancelAtPeriodEnd),
    stripeEventType: stripeEventType || null,
    updatedAt: new Date(),
  };
}
