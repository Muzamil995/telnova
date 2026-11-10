import { NextResponse } from "next/server";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import {
  getPlanFromStripePriceId,
  getStripeClient,
  mapStripeSubscriptionStatus,
  normalizeSubscriptionFromStripe,
  toDateOrNull,
} from "@/lib/stripe";

export const runtime = "nodejs";

async function findUserForStripeEvent({
  customerId,
  subscriptionId,
  userId,
  email,
}) {
  if (userId) {
    const user = await User.findById(userId);
    if (user) {
      return user;
    }
  }

  if (customerId) {
    const user = await User.findOne({
      "subscription.stripeCustomerId": customerId,
    });

    if (user) {
      return user;
    }
  }

  if (subscriptionId) {
    const user = await User.findOne({
      "subscription.stripeSubscriptionId": subscriptionId,
    });

    if (user) {
      return user;
    }
  }

  if (email) {
    return User.findOne({ email: String(email).toLowerCase() });
  }

  return null;
}

function getFirstPriceId(subscription) {
  const item = subscription?.items?.data?.[0];
  return item?.price?.id || null;
}

export async function POST(request) {
  try {
    await connectToDB();

    const stripe = getStripeClient();
    const signature = request.headers.get("stripe-signature");
    const rawBody = await request.text();

    if (!process.env.STRIPE_WEBHOOK_SECRET) {
      return NextResponse.json(
        { success: false, message: "Missing STRIPE_WEBHOOK_SECRET" },
        { status: 500 },
      );
    }

    if (!signature) {
      return NextResponse.json(
        { success: false, message: "Missing Stripe signature" },
        { status: 400 },
      );
    }

    let event;
    try {
      event = stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: `Invalid webhook signature: ${error.message}`,
        },
        { status: 400 },
      );
    }

    const eventType = event.type;

    if (
      eventType === "checkout.session.completed" ||
      eventType === "checkout.session.async_payment_succeeded"
    ) {
      const session = event.data.object;
      const user = await findUserForStripeEvent({
        customerId: session.customer,
        subscriptionId: session.subscription,
        userId: session.metadata?.userId,
        email: session.customer_details?.email || session.customer_email,
      });

      if (!user) {
        return NextResponse.json(
          { success: true, message: "No matching user for checkout session" },
          { status: 200 },
        );
      }

      const selectedPlan = session.metadata?.plan || "free";

      if (session.mode === "payment" && selectedPlan === "lifetime") {
        user.subscription = normalizeSubscriptionFromStripe({
          ...user.subscription,
          stripeCustomerId:
            session.customer || user.subscription?.stripeCustomerId,
          stripeSubscriptionId: null,
          stripePriceId:
            session.metadata?.priceId || user.subscription?.stripePriceId,
          status: "active",
          plan: "lifetime",
          currentPeriodStart: new Date(),
          currentPeriodEnd: null,
          cancelAtPeriodEnd: false,
          stripeEventType: eventType,
        });

        await user.save();
      }

      if (session.mode === "subscription") {
        let subscription = null;

        if (session.subscription) {
          subscription = await stripe.subscriptions.retrieve(
            session.subscription,
          );
        }

        const subscriptionPriceId = getFirstPriceId(subscription);
        const planFromPrice = getPlanFromStripePriceId(subscriptionPriceId);
        const nextPlan = planFromPrice || selectedPlan;

        user.subscription = normalizeSubscriptionFromStripe({
          ...user.subscription,
          stripeCustomerId:
            session.customer || user.subscription?.stripeCustomerId,
          stripeSubscriptionId:
            session.subscription || user.subscription?.stripeSubscriptionId,
          stripePriceId:
            subscriptionPriceId || user.subscription?.stripePriceId,
          status: mapStripeSubscriptionStatus(subscription?.status || "active"),
          plan: nextPlan,
          currentPeriodStart: toDateOrNull(subscription?.current_period_start),
          currentPeriodEnd: toDateOrNull(subscription?.current_period_end),
          cancelAtPeriodEnd: Boolean(subscription?.cancel_at_period_end),
          stripeEventType: eventType,
        });

        await user.save();
      }
    }

    if (
      eventType === "customer.subscription.created" ||
      eventType === "customer.subscription.updated" ||
      eventType === "customer.subscription.deleted"
    ) {
      const subscription = event.data.object;
      const priceId = getFirstPriceId(subscription);
      const planFromPrice = getPlanFromStripePriceId(priceId);
      const normalizedStatus = mapStripeSubscriptionStatus(subscription.status);

      const user = await findUserForStripeEvent({
        customerId: subscription.customer,
        subscriptionId: subscription.id,
        userId: subscription.metadata?.userId,
      });

      if (user) {
        const isDeletedEvent = eventType === "customer.subscription.deleted";

        user.subscription = normalizeSubscriptionFromStripe({
          ...user.subscription,
          stripeCustomerId:
            subscription.customer || user.subscription?.stripeCustomerId,
          stripeSubscriptionId: isDeletedEvent ? null : subscription.id,
          stripePriceId: isDeletedEvent ? null : priceId,
          status: isDeletedEvent ? "canceled" : normalizedStatus,
          plan: isDeletedEvent
            ? "free"
            : planFromPrice || user.subscription?.plan || "free",
          currentPeriodStart: isDeletedEvent
            ? null
            : toDateOrNull(subscription.current_period_start),
          currentPeriodEnd: isDeletedEvent
            ? null
            : toDateOrNull(subscription.current_period_end),
          cancelAtPeriodEnd: isDeletedEvent
            ? false
            : Boolean(subscription.cancel_at_period_end),
          stripeEventType: eventType,
        });

        await user.save();
      }
    }

    if (eventType === "invoice.payment_failed") {
      const invoice = event.data.object;
      const user = await findUserForStripeEvent({
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
      });

      if (user) {
        user.subscription = normalizeSubscriptionFromStripe({
          ...user.subscription,
          stripeCustomerId:
            invoice.customer || user.subscription?.stripeCustomerId,
          stripeSubscriptionId:
            invoice.subscription || user.subscription?.stripeSubscriptionId,
          stripePriceId: user.subscription?.stripePriceId,
          status: "past_due",
          plan: user.subscription?.plan || "free",
          currentPeriodStart: user.subscription?.currentPeriodStart,
          currentPeriodEnd: user.subscription?.currentPeriodEnd,
          cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd,
          stripeEventType: eventType,
        });

        await user.save();
      }
    }

    if (eventType === "invoice.paid") {
      const invoice = event.data.object;
      const user = await findUserForStripeEvent({
        customerId: invoice.customer,
        subscriptionId: invoice.subscription,
      });

      if (user && user.subscription?.plan !== "lifetime") {
        user.subscription = normalizeSubscriptionFromStripe({
          ...user.subscription,
          stripeCustomerId:
            invoice.customer || user.subscription?.stripeCustomerId,
          stripeSubscriptionId:
            invoice.subscription || user.subscription?.stripeSubscriptionId,
          stripePriceId: user.subscription?.stripePriceId,
          status: "active",
          plan: user.subscription?.plan || "free",
          currentPeriodStart: user.subscription?.currentPeriodStart,
          currentPeriodEnd: user.subscription?.currentPeriodEnd,
          cancelAtPeriodEnd: user.subscription?.cancelAtPeriodEnd,
          stripeEventType: eventType,
        });

        await user.save();
      }
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Stripe webhook error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to process Stripe webhook",
      },
      { status: 500 },
    );
  }
}
