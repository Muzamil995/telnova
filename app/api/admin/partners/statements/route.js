import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import PartnerStatementRequest from "@/models/partnerStatementRequestModel";

function serializeStatementRequest(statementRequest) {
  return {
    _id: String(statementRequest._id),
    partnerId: statementRequest.partner
      ? String(statementRequest.partner._id || statementRequest.partner)
      : null,
    userId: statementRequest.user
      ? String(statementRequest.user._id || statementRequest.user)
      : null,
    partnerName: statementRequest.partnerName,
    partnerTFN: statementRequest.partnerTFN,
    status: statementRequest.status,
    requestedAt: statementRequest.requestedAt,
    deliveredAt: statementRequest.deliveredAt,
    notes: statementRequest.notes,
    user:
      statementRequest.user && typeof statementRequest.user === "object"
        ? {
            _id: String(statementRequest.user._id),
            email: statementRequest.user.email,
            phoneNumber: statementRequest.user.phoneNumber,
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
    const status = ["pending", "delivered"].includes(searchParams.get("status"))
      ? searchParams.get("status")
      : "pending";
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit"), 10) || 50),
    );

    const statementRequests = await PartnerStatementRequest.find({ status })
      .populate("user", "email phoneNumber")
      .sort({ requestedAt: -1 })
      .limit(limit)
      .lean();

    return NextResponse.json({
      success: true,
      statementRequests: statementRequests.map(serializeStatementRequest),
    });
  } catch (error) {
    console.error("Fetch partner statement requests error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch TFN statement requests" },
      { status: 500 },
    );
  }
}
