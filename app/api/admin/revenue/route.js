import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { getStripeClient, getStripeConfig } from "@/lib/stripe";
import User from "@/models/userModel";
import { connectToDB } from "@/configs/database";

function sumPaidInvoices(invoices) {
  return invoices.reduce((sum, invoice) => sum + (invoice.amount_paid || 0), 0);
}

function sumPaidLifetimeSessions(sessions) {
  return sessions
    .filter(
      (session) =>
        session.mode === "payment" &&
        session.payment_status === "paid" &&
        session.metadata?.plan === "lifetime",
    )
    .reduce((sum, session) => sum + (session.amount_total || 0), 0);
}

/**
 * GET /api/admin/revenue
 * Returns total all-time revenue and current-month revenue from Stripe.
 * Restricted to admin role — verified via JWT cookie.
 */
export async function GET(request) {
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

    const authUser = await User.findById(decoded.userId).select("role").lean();
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const stripe = getStripeClient();
    const stripeConfig = getStripeConfig();

    // Start of current month (UTC)
    const now = new Date();
    const startOfMonth = Math.floor(
      new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1)).getTime() /
        1000,
    );

    // Revenue is derived from app-level Stripe objects:
    // - paid invoices for subscription revenue
    // - paid payment-mode checkout sessions for lifetime purchases
    const [allInvoices, monthInvoices, allSessions, monthSessions] =
      await Promise.all([
        stripe.invoices
          .list({ status: "paid", limit: 100 })
          .autoPagingToArray({ limit: 10000 }),
        stripe.invoices
          .list({ status: "paid", created: { gte: startOfMonth }, limit: 100 })
          .autoPagingToArray({ limit: 10000 }),
        stripe.checkout.sessions
          .list({ limit: 100 })
          .autoPagingToArray({ limit: 10000 }),
        stripe.checkout.sessions
          .list({ created: { gte: startOfMonth }, limit: 100 })
          .autoPagingToArray({ limit: 10000 }),
      ]);

    const totalRevenueCents =
      sumPaidInvoices(allInvoices) + sumPaidLifetimeSessions(allSessions);
    const monthRevenueCents =
      sumPaidInvoices(monthInvoices) + sumPaidLifetimeSessions(monthSessions);

    const fmt = (cents) =>
      new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: String(stripeConfig.currency || "usd").toUpperCase(),
      }).format(cents / 100);

    return NextResponse.json({
      success: true,
      totalRevenue: fmt(totalRevenueCents),
      thisMonthRevenue: fmt(monthRevenueCents),
    });
  } catch (error) {
    console.error("Admin revenue fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch revenue data" },
      { status: 500 },
    );
  }
}
