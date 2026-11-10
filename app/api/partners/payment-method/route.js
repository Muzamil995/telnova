import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";
import Partner from "@/models/partnerModel";
import {
  getPaymentMethodSummary,
  hasSavedPaymentMethod,
  normalizePaymentMethod,
} from "@/lib/partner-utils";

export async function PATCH(request) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["partner"],
      select: "_id role",
      lean: false,
    });

    if (error) {
      return error;
    }

    const body = await request.json();
    const paymentMethod = normalizePaymentMethod(body.paymentMethod || {});

    if (!hasSavedPaymentMethod(paymentMethod)) {
      return NextResponse.json(
        {
          success: false,
          message: "Please complete your PayPal or US bank details",
        },
        { status: 400 },
      );
    }

    const partner = await Partner.findOne({ user: user._id });

    if (!partner) {
      return NextResponse.json(
        { success: false, message: "Partner profile not found" },
        { status: 404 },
      );
    }

    partner.paymentMethod = paymentMethod;
    await partner.save();

    return NextResponse.json({
      success: true,
      message: "Payment method saved successfully",
      partner: {
        _id: String(partner._id),
        paymentMethod: partner.paymentMethod,
        paymentMethodSummary: getPaymentMethodSummary(partner.paymentMethod),
        hasSavedPaymentMethod: true,
      },
    });
  } catch (error) {
    console.error("Save partner payment method error:", error);

    return NextResponse.json(
      { success: false, message: "Failed to save payment method" },
      { status: 500 },
    );
  }
}
