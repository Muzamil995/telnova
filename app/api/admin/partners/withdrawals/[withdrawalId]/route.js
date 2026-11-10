import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import { getPaymentMethodSummary } from "@/lib/partner-utils";

function serializeWithdrawal(withdrawal) {
  return {
    _id: String(withdrawal._id),
    partnerId: String(withdrawal.partner),
    userId: String(withdrawal.user),
    partnerName: withdrawal.partnerName,
    partnerTFN: withdrawal.partnerTFN,
    amount: withdrawal.amount,
    status: withdrawal.status,
    paymentMethod: withdrawal.paymentMethod,
    paymentMethodSummary: getPaymentMethodSummary(withdrawal.paymentMethod),
    requestedAt: withdrawal.requestedAt,
    paidAt: withdrawal.paidAt,
    notes: withdrawal.notes,
  };
}

export async function PATCH(request, { params }) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
      select: "_id role",
      lean: false,
    });

    if (error) {
      return error;
    }

    const { withdrawalId } = await params;
    const body = await request.json().catch(() => ({}));
    const notes = String(body.notes || "").trim();

    const withdrawal = await PartnerWithdrawal.findById(withdrawalId);

    if (!withdrawal) {
      return NextResponse.json(
        { success: false, message: "Withdrawal not found" },
        { status: 404 },
      );
    }

    if (withdrawal.status !== "pending") {
      return NextResponse.json(
        { success: false, message: "Withdrawal has already been processed" },
        { status: 400 },
      );
    }

    const partner = await Partner.findById(withdrawal.partner);

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 },
      );
    }

    withdrawal.status = "paid";
    withdrawal.paidAt = new Date();
    withdrawal.paidBy = user._id;
    withdrawal.notes = notes;

    partner.totalWithdrawn += withdrawal.amount;

    await Promise.all([withdrawal.save(), partner.save()]);

    return NextResponse.json({
      success: true,
      message: "Withdrawal marked as paid",
      withdrawal: serializeWithdrawal(withdrawal),
    });
  } catch (error) {
    console.error("Update partner withdrawal error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update withdrawal" },
      { status: 500 },
    );
  }
}
