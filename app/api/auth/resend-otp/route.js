import { NextResponse } from "next/server";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { createOTP, hasValidOTP, getOTPRemainingTime } from "@/utils/otp";
import { sendOTPEmail } from "@/services/emailService";
import { sendOTPSMS } from "@/services/smsService";

export async function POST(request) {
  try {
    await connectToDB();

    const {
      userId,
      email,
      type = "email",
      purpose = "verification",
    } = await request.json();

    // Validate required fields
    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    // Find user
    const user = await User.findById(userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Verify email matches if provided
    if (email && user.email !== email.toLowerCase()) {
      return NextResponse.json(
        { success: false, message: "Email does not match user account" },
        { status: 400 },
      );
    }

    // Check if already verified
    if (type === "email" && user.emailVerified) {
      return NextResponse.json(
        { success: false, message: "Email is already verified" },
        { status: 400 },
      );
    }

    if (type === "phone" && user.phoneVerified) {
      return NextResponse.json(
        { success: false, message: "Phone number is already verified" },
        { status: 400 },
      );
    }

    // Check if a valid OTP already exists
    const hasValid = await hasValidOTP({
      userId: user._id,
      type,
      purpose,
    });

    if (hasValid) {
      // Get remaining time for the existing OTP
      const timeInfo = await getOTPRemainingTime({
        userId: user._id,
        type,
        purpose,
      });

      if (timeInfo.success) {
        return NextResponse.json(
          {
            success: false,
            message: `An OTP was already sent. Please wait ${Math.ceil(timeInfo.remainingSeconds / 60)} minutes before requesting a new one.`,
            remainingSeconds: timeInfo.remainingSeconds,
          },
          { status: 429 },
        );
      }
    }

    // Generate new OTP
    const otpResult = await createOTP({
      userId: user._id,
      email: type === "email" ? user.email : undefined,
      phoneNumber: type === "phone" ? user.phoneNumber : undefined,
      type,
      purpose,
      expiryMinutes: 5,
    });

    // Send OTP based on type
    let sendResult;

    if (type === "email") {
      sendResult = await sendOTPEmail({
        to: user.email,
        otp: otpResult.otp,
        userName: user.fullName,
        expiryMinutes: 5,
      });

      if (!sendResult.success) {
        console.error("Failed to send OTP via email:", sendResult.message);
        return NextResponse.json(
          {
            success: false,
            message: "Failed to send OTP email. Please try again.",
          },
          { status: 500 },
        );
      }
    } else if (type === "phone") {
      sendResult = await sendOTPSMS({
        to: user.phoneNumber,
        otp: otpResult.otp,
        userName: user.fullName,
        expiryMinutes: 5,
      });

      if (!sendResult.success) {
        console.error("Failed to send OTP via SMS:", sendResult.message);
        return NextResponse.json(
          {
            success: false,
            message: `Failed to send OTP via SMS. ${sendResult.message}`,
          },
          { status: 500 },
        );
      }
    }

    const deliveryChannel = type === "email" ? "email" : "SMS";

    return NextResponse.json(
      {
        success: true,
        message: `OTP sent successfully via ${deliveryChannel}`,
        expiresAt: otpResult.expiresAt,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Resend OTP error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
