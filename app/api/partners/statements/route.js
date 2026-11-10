import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import PartnerStatementRequest from "@/models/partnerStatementRequestModel";

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

    const statementRequests = await PartnerStatementRequest.find({
      partner: partner._id,
    })
      .sort({ requestedAt: -1 })
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

    const partner = await Partner.findOne({ user: user._id });

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner profile not found" },
        { status: 404 },
      );
    }

    const existingPendingRequest = await PartnerStatementRequest.findOne({
      partner: partner._id,
      status: "pending",
    }).lean();

    if (existingPendingRequest) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a pending TFN statement request",
        },
        { status: 400 },
      );
    }

    const statementRequest = await PartnerStatementRequest.create({
      partner: partner._id,
      user: user._id,
      partnerName: partner.partnerName,
      partnerTFN: partner.partnerTFN,
      status: "pending",
    });

    return NextResponse.json(
      {
        success: true,
        message: "TFN statement request submitted",
        statementRequest: serializeStatementRequest(statementRequest),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create partner statement request error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to request TFN statement" },
      { status: 500 },
    );
  }
}
