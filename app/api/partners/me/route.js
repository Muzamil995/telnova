import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import PartnerStatementRequest from "@/models/partnerStatementRequestModel";
import {
  getPaymentMethodSummary,
  hasSavedPaymentMethod,
  isEligibleForWithdrawal,
  MIN_PARTNER_WITHDRAWAL_BALANCE,
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

function serializeStatementRequest(statementRequest) {
  return {
    _id: String(statementRequest._id),
    status: statementRequest.status,
    requestedAt: statementRequest.requestedAt,
    deliveredAt: statementRequest.deliveredAt,
    notes: statementRequest.notes,
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

    const [withdrawals, statementRequests] = await Promise.all([
      PartnerWithdrawal.find({ partner: partner._id })
        .sort({ requestedAt: -1 })
        .lean(),
      PartnerStatementRequest.find({ partner: partner._id })
        .sort({ requestedAt: -1 })
        .lean(),
    ]);

    const paymentConfigured = hasSavedPaymentMethod(partner.paymentMethod);

    return NextResponse.json({
      success: true,
      partner: {
        _id: String(partner._id),
        partnerName: partner.partnerName,
        partnerTFN: partner.partnerTFN,
        currentBalance: partner.currentBalance,
        totalWithdrawn: partner.totalWithdrawn,
        paymentMethod: partner.paymentMethod,
        paymentMethodSummary: getPaymentMethodSummary(partner.paymentMethod),
        hasSavedPaymentMethod: paymentConfigured,
        canRequestWithdrawal:
          paymentConfigured && isEligibleForWithdrawal(partner.currentBalance),
        minimumWithdrawalBalance: MIN_PARTNER_WITHDRAWAL_BALANCE,
        createdAt: partner.createdAt,
      },
      user,
      withdrawals: withdrawals.map(serializeWithdrawal),
      statementRequests: statementRequests.map(serializeStatementRequest),
    });
  } catch (error) {
    console.error("Fetch partner profile error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch partner profile" },
      { status: 500 },
    );
  }
}
