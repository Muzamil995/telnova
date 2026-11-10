import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import User from "@/models/userModel";
import PartnerWithdrawal from "@/models/partnerWithdrawalModel";
import {
  getPaymentMethodSummary,
  hasSavedPaymentMethod,
  normalizePaymentMethod,
} from "@/lib/partner-utils";

function escapeRegex(value) {
  return String(value || "").replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

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

export async function GET(request) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
    });

    if (error) {
      return error;
    }

    const { searchParams } = new URL(request.url);
    const page = Math.max(1, parseInt(searchParams.get("page"), 10) || 1);
    const limit = Math.min(
      100,
      Math.max(1, parseInt(searchParams.get("limit"), 10) || 20),
    );
    const search = String(searchParams.get("search") || "")
      .trim()
      .slice(0, 100);

    const filter = {};

    if (search) {
      const safeSearch = escapeRegex(search);
      const regex = { $regex: safeSearch, $options: "i" };
      const matchingUsers = await User.find(
        {
          $or: [{ fullName: regex }, { email: regex }, { phoneNumber: regex }],
        },
        "_id",
      ).lean();

      const matchingUserIds = matchingUsers.map((item) => item._id);

      filter.$or = [{ partnerName: regex }, { partnerTFN: regex }];

      if (matchingUserIds.length > 0) {
        filter.$or.push({ user: { $in: matchingUserIds } });
      }
    }

    const skip = (page - 1) * limit;

    const [partners, totalCount, totals, pendingWithdrawals] =
      await Promise.all([
        Partner.find(filter)
          .populate(
            "user",
            "fullName email phoneNumber role isActive createdAt",
          )
          .sort({ createdAt: -1 })
          .skip(skip)
          .limit(limit)
          .lean(),
        Partner.countDocuments(filter),
        Partner.aggregate([
          {
            $group: {
              _id: null,
              totalCurrentBalance: { $sum: "$currentBalance" },
              totalWithdrawn: { $sum: "$totalWithdrawn" },
              partnerCount: { $sum: 1 },
            },
          },
        ]),
        PartnerWithdrawal.countDocuments({ status: "pending" }),
      ]);

    const summary = totals[0] || {
      totalCurrentBalance: 0,
      totalWithdrawn: 0,
      partnerCount: 0,
    };

    return NextResponse.json({
      success: true,
      partners: partners.map(serializePartner),
      summary: {
        totalPartners: summary.partnerCount,
        totalCurrentBalance: summary.totalCurrentBalance,
        totalWithdrawn: summary.totalWithdrawn,
        pendingWithdrawals,
      },
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit) || 1,
        totalCount,
        limit,
      },
      requestedBy: user._id,
    });
  } catch (error) {
    console.error("Fetch partners error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to fetch partners" },
      { status: 500 },
    );
  }
}

export async function POST(request) {
  try {
    const { error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["admin"],
      lean: false,
    });

    if (error) {
      return error;
    }

    const body = await request.json();
    const partnerName = String(body.partnerName || "").trim();
    const email = String(body.email || "")
      .trim()
      .toLowerCase();
    const password = String(body.password || "");
    const phoneNumber = String(body.phoneNumber || "").trim();
    const partnerTFN = String(body.partnerTFN || "").trim();
    const currentBalance = Number(body.currentBalance || 0);
    const totalWithdrawn = Number(body.totalWithdrawn || 0);
    const paymentMethod = normalizePaymentMethod(body.paymentMethod || {});

    if (!partnerName || !email || !password || !phoneNumber || !partnerTFN) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Partner name, email, password, phone number, and TFN are required",
        },
        { status: 400 },
      );
    }

    if (Number.isNaN(currentBalance) || currentBalance < 0) {
      return NextResponse.json(
        { success: false, message: "Current balance must be 0 or more" },
        { status: 400 },
      );
    }

    if (Number.isNaN(totalWithdrawn) || totalWithdrawn < 0) {
      return NextResponse.json(
        { success: false, message: "Total withdrawn must be 0 or more" },
        { status: 400 },
      );
    }

    if (paymentMethod.type && !hasSavedPaymentMethod(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete the selected payment method details",
        },
        { status: 400 },
      );
    }

    let createdUser;

    try {
      createdUser = await User.create({
        fullName: partnerName,
        email,
        password,
        phoneNumber,
        role: "partner",
        isActive: true,
      });

      const partner = await Partner.create({
        user: createdUser._id,
        partnerName,
        partnerTFN,
        currentBalance,
        totalWithdrawn,
        paymentMethod,
      });

      const populatedPartner = await Partner.findById(partner._id)
        .populate("user", "fullName email phoneNumber role isActive createdAt")
        .lean();

      return NextResponse.json(
        {
          success: true,
          message: "Partner created successfully",
          partner: serializePartner(populatedPartner),
        },
        { status: 201 },
      );
    } catch (error) {
      if (createdUser?._id) {
        await User.findByIdAndDelete(createdUser._id);
      }

      if (error?.code === 11000) {
        const duplicateField =
          Object.keys(error.keyPattern || {})[0] || "field";
        return NextResponse.json(
          {
            success: false,
            message: `${duplicateField} already exists`,
          },
          { status: 409 },
        );
      }

      if (error?.name === "ValidationError") {
        const firstMessage = Object.values(error.errors || {})[0]?.message;
        return NextResponse.json(
          {
            success: false,
            message: firstMessage || "Failed to validate partner",
          },
          { status: 400 },
        );
      }

      throw error;
    }
  } catch (error) {
    console.error("Create partner error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to create partner" },
      { status: 500 },
    );
  }
}
