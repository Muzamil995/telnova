import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import { getPaymentMethodSummary } from "@/lib/partner-utils";

function serializeWithdrawal(withdrawal) {
  return {
    _id: String(withdrawal._id),
    partnerId: withdrawal.partner
      ? String(withdrawal.partner._id || withdrawal.partner)
      : null,
    userId: withdrawal.user
      ? String(withdrawal.user._id || withdrawal.user)
      : null,
    partnerName: withdrawal.partnerName,
    partnerTFN: withdrawal.partnerTFN,
    amount: withdrawal.amount,
    status: withdrawal.status,
    paymentMethod: withdrawal.paymentMethod,
    paymentMethodSummary: getPaymentMethodSummary(withdrawal.paymentMethod),
    requestedAt: withdrawal.requestedAt,
    paidAt: withdrawal.paidAt,
    notes: withdrawal.notes,
    user:
      withdrawal.user && typeof withdrawal.user === "object"
        ? {
            _id: String(withdrawal.user._id),
            email: withdrawal.user.email,
            phoneNumber: withdrawal.user.phoneNumber,
          }
        : null,
  };
}

export async function GET(request) {
  try {
    const { error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
    });

    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const status = ["pending", "paid"].includes(searchParams.get("status"))
      ? searchParams.get("status")
      : "pending";
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit"), 10) || 50),
    );

    const withdrawals = await PartnerWithdrawal.find({ status })
      .populate("user", "email phoneNumber")
      .sort({ requestedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      withdrawals: withdrawals.map(serializeWithdrawal),
    });
  } catch (error) {
    console.error("Fetch partner withdrawals error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch partner withdrawals" },
      { status: 500 },
    );
  }
}
