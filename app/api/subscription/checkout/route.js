import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { getStripeClient, getStripePlanConfig } from "@/lib/stripe";

const ALLOWED_PLANS = ["monthly", "yearly", "lifetime"];

export async function POST(request) {
  try {
    await connectToDB();

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const { plan } = await request.json();

    if (!ALLOWED_PLANS.includes(plan)) {
      return NextResponse.json(
        { success: false, message: "Invalid plan selection" },
        { status: 400 },
      );
    }

    const selectedPlan = getStripePlanConfig(plan);

    if (!selectedPlan) {
      return NextResponse.json(
        { success: false, message: "Plan is not configured" },
        { status: 500 },
      );
    }

    if (!selectedPlan.priceId) {
      return NextResponse.json(
        {
          success: false,
          message: `${plan} Stripe price ID is not configured in environment variables`,
        },
        { status: 500 },
      );
    }

    const stripe = getStripeClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://telnova.ai";
    const successUrl = `${appUrl}/dashboard?checkout=success&session_id={CHECKOUT_SESSION_ID}`;
    const cancelUrl = `${appUrl}/subscription?checkout=canceled&plan=${plan}`;

    const hasStripeCustomer = Boolean(user.subscription?.stripeCustomerId);

    const session = await stripe.checkout.sessions.create({
      mode: selectedPlan.mode,
      customer: hasStripeCustomer
        ? user.subscription.stripeCustomerId
        : undefined,
      customer_email: hasStripeCustomer ? undefined : user.email,
      line_items: [
        {
          price: selectedPlan.priceId,
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      client_reference_id: String(user._id),
      metadata: {
        userId: String(user._id),
        plan,
        priceId: selectedPlan.priceId,
      },
      subscription_data:
        selectedPlan.mode === "subscription"
          ? {
              metadata: {
                userId: String(user._id),
                plan,
              },
            }
          : undefined,
      customer_creation:
        selectedPlan.mode === "payment" && !hasStripeCustomer
          ? "always"
          : undefined,
      allow_promotion_codes: true,
    });

    const checkoutUrl = session?.url;

    if (!checkoutUrl) {
      return NextResponse.json(
        { success: false, message: "Failed to create checkout link" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        plan,
        checkoutUrl,
        mode: selectedPlan.mode,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create subscription checkout error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create checkout session",
      },
      { status: 500 },
    );
  }
}
