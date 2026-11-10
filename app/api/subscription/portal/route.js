import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { getStripeClient } from "@/lib/stripe";

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

    if (!user.subscription?.stripeCustomerId) {
      return NextResponse.json(
        {
          success: false,
          message: "No Stripe customer found for this user",
        },
        { status: 400 },
      );
    }

    const stripe = getStripeClient();
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://telnova.ai";

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: user.subscription.stripeCustomerId,
      return_url: `${appUrl}/subscription`,
    });

    return NextResponse.json(
      {
        success: true,
        url: portalSession.url,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Create Stripe portal session error:", error);

    return NextResponse.json(
      {
        success: false,
        message: error?.message || "Failed to create billing portal session",
      },
      { status: 500 },
    );
  }
}
