import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import PartnerStatementRequest from "@/models/partnerStatementRequestModel";

function serializeStatementRequest(statementRequest) {
  return {
    _id: String(statementRequest._id),
    partnerId: String(statementRequest.partner),
    userId: String(statementRequest.user),
    partnerName: statementRequest.partnerName,
    partnerTFN: statementRequest.partnerTFN,
    status: statementRequest.status,
    requestedAt: statementRequest.requestedAt,
    deliveredAt: statementRequest.deliveredAt,
    notes: statementRequest.notes,
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

    const { statementId } = await params;
    const body = await request.json().catch(() => ({}));
    const notes = String(body.notes || "").trim();

    const statementRequest =
      await PartnerStatementRequest.findById(statementId);

    if (!statementRequest) {
      return NextResponse.json(
        { success: false, message: "Statement request not found" },
        { status: 404 },
      );
    }

    if (statementRequest.status !== "pending") {
      return NextResponse.json(
        {
          success: false,
          message: "Statement request has already been processed",
        },
        { status: 400 },
      );
    }

    statementRequest.status = "delivered";
    statementRequest.deliveredAt = new Date();
    statementRequest.deliveredBy = user._id;
    statementRequest.notes = notes;

    await statementRequest.save();

    return NextResponse.json({
      success: true,
      message: "Statement marked as delivered",
      statementRequest: serializeStatementRequest(statementRequest),
    });
  } catch (error) {
    console.error("Update statement request error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to update statement request" },
      { status: 500 },
    );
  }
}
