import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import PartnerStatementRequest from "@/models/partnerStatementRequestModel";
import {
  getPaymentMethodSummary,
  hasSavedPaymentMethod,
} from "@/lib/partner-utils";

function serializePartner(partner) {
  return {
    _id: String(partner._id),
    partnerName: partner.partnerName,
    partnerTFN: partner.partnerTFN,
    currentBalance: partner.currentBalance,
    totalWithdrawn: partner.totalWithdrawn,
    paymentMethod: partner.paymentMethod,
    paymentMethodSummary: getPaymentMethodSummary(partner.paymentMethod),
    hasSavedPaymentMethod: hasSavedPaymentMethod(partner.paymentMethod),
    createdAt: partner.createdAt,
    updatedAt: partner.updatedAt,
    user: partner.user
      ? {
          _id: String(partner.user._id),
          fullName: partner.user.fullName,
          email: partner.user.email,
          phoneNumber: partner.user.phoneNumber,
          role: partner.user.role,
          isActive: partner.user.isActive,
          createdAt: partner.user.createdAt,
        }
      : null,
  };
}

function serializeWithdrawal(withdrawal) {
  return {
    _id: String(withdrawal._id),
    amount: withdrawal.amount,
    status: withdrawal.status,
    paymentMethod: withdrawal.paymentMethod,
    paymentMethodSummary: getPaymentMethodSummary(withdrawal.paymentMethod),
    requestedAt: withdrawal.requestedAt,
    paidAt: withdrawal.paidAt,
    notes: withdrawal.notes,
    createdAt: withdrawal.createdAt,
    updatedAt: withdrawal.updatedAt,
  };
}

function serializeStatementRequest(statementRequest) {
  return {
    _id: String(statementRequest._id),
    status: statementRequest.status,
    requestedAt: statementRequest.requestedAt,
    deliveredAt: statementRequest.deliveredAt,
    notes: statementRequest.notes,
    createdAt: statementRequest.createdAt,
    updatedAt: statementRequest.updatedAt,
  };
}

export async function GET(request, { params }) {
  try {
    const { error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
    });

    if (error) {
      return error;
    }

    const { partnerId } = await params;

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: "Partner ID is required" },
        { status: 400 },
      );
    }

    const partner = await Partner.findById(partnerId)
      .populate("user", "fullName email phoneNumber role isActive createdAt")
      .lean();

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 },
      );
    }

    const [withdrawals, statementRequests] = await Promise.all([
      PartnerWithdrawal.find({ partner: partnerId })
        .sort({ requestedAt: -1 })
        .lean(),
      PartnerStatementRequest.find({ partner: partnerId })
        .sort({ requestedAt: -1 })
        .lean(),
    ]);

    return NextResponse.json({
      success: true,
      partner: serializePartner(partner),
      withdrawals: withdrawals.map(serializeWithdrawal),
      statementRequests: statementRequests.map(serializeStatementRequest),
    });
  } catch (error) {
    console.error("Fetch partner details error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch partner details" },
      { status: 500 },
    );
  }
}

export async function PATCH(request, { params }) {
  try {
    const { error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
      lean: false,
    });

    if (error) {
      return error;
    }

    const { partnerId } = await params;
    const body = await request.json();
    const currentBalance = Number(body.currentBalance);

    if (!partnerId) {
      return NextResponse.json(
        { success: false, message: "Partner ID is required" },
        { status: 400 },
      );
    }

    if (Number.isNaN(currentBalance) || currentBalance < 0) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Partner balance must be a number greater than or equal to 0",
        },
        { status: 400 },
      );
    }

    const partner = await Partner.findByIdAndUpdate(
      partnerId,
      { currentBalance },
      { new: true, runValidators: true },
    )
      .populate("user", "fullName email phoneNumber role isActive createdAt")
      .lean();

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner not found" },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Partner balance updated successfully",
      partner: serializePartner(partner),
    });
  } catch (error) {
    console.error("Update partner balance error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update partner balance" },
      { status: 500 },
    );
  }
}
