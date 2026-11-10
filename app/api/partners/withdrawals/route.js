import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import {
  getPaymentMethodSummary,
  hasSavedPaymentMethod,
  isEligibleForWithdrawal,
  MIN_PARTNER_WITHDRAWAL_BALANCE,
  normalizePaymentMethod,
} from "@/lib/partner-utils";

function serializeWithdrawal(withdrawal) {
  return {
    _id: String(withdrawal._id),
    amount: withdrawal.amount,
    status: withdrawal.status,
    paymentMethodSummary: getPaymentMethodSummary(withdrawal.paymentMethod),
    requestedAt: withdrawal.requestedAt,
    paidAt: withdrawal.paidAt,
    notes: withdrawal.notes,
  };
}

export async function GET(request) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["partner"],
    });

    if (error) {
      return error;
    }

    const partner = await Partner.findOne({ user: user._id }).lean();

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner profile not found" },
        { status: 404 },
      );
    }

    const withdrawals = await PartnerWithdrawal.find({ partner: partner._id })
      .sort({ requestedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map(serializeWithdrawal),
    });
  } catch (error) {
    console.error("Fetch partner withdrawal history error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch withdrawal history" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["partner"],
      select: "_id role",
      lean: false,
    });

    if (error) {
      return error;
    }

    const body = await request.json().catch(() => ({}));
    const partner = await Partner.findOne({ user: user._id });

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner profile not found" },
        { status: 404 },
      );
    }

    if (!hasSavedPaymentMethod(partner.paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Add your payment details before requesting a withdrawal",
          requiresPaymentMethod: true,
        },
        { status: 400 },
      );
    }

    if (!isEligibleForWithdrawal(partner.currentBalance)) {
      return NextResponse.json(
        {
          success: false,
          message: `Balance must be greater than ${MIN_PARTNER_WITHDRAWAL_BALANCE} to request a withdrawal`,
        },
        { status: 400 },
      );
    }

    const existingPendingWithdrawal = await PartnerWithdrawal.findOne({
      partner: partner._id,
      status: "pending",
    }).lean();

    if (existingPendingWithdrawal) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a pending withdrawal request",
        },
        { status: 400 },
      );
    }

    const availableBalance = Number(partner.currentBalance || 0);
    const requestedAmount = Number(body?.amount);

    if (!Number.isFinite(requestedAmount) || requestedAmount <= 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Enter a valid withdrawal amount",
        },
        { status: 400 },
      );
    }

    const amount = Math.round(requestedAmount * 100) / 100;

    if (amount > availableBalance) {
      return NextResponse.json(
        {
          success: false,
          message: "Withdrawal amount cannot exceed your available balance",
        },
        { status: 400 },
      );
    }

    const paymentMethod = normalizePaymentMethod(partner.paymentMethod);

    const withdrawal = await PartnerWithdrawal.create({
      partner: partner._id,
      user: user._id,
      partnerName: partner.partnerName,
      partnerTFN: partner.partnerTFN,
      amount,
      paymentMethod,
      status: "pending",
    });

    partner.currentBalance = Math.max(
      0,
      Math.round((availableBalance - amount) * 100) / 100,
    );
    await partner.save();

    return NextResponse.json(
      {
        success: true,
        message: "Withdrawal request submitted",
        withdrawal: serializeWithdrawal(withdrawal),
        partner: {
          _id: String(partner._id),
          currentBalance: partner.currentBalance,
          totalWithdrawn: partner.totalWithdrawn,
          paymentMethodSummary: getPaymentMethodSummary(partner.paymentMethod),
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create partner withdrawal error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to request withdrawal" },
      { status: 500 },
    );
  }
}
