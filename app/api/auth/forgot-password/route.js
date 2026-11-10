import { NextResponse } from "next/server";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { sendPasswordResetEmail } from "@/services/emailService";

const GENERIC_MESSAGE =
  "If an account with that email exists, a password reset link has been sent.";

export async function POST(request) {
  try {
    await connectToDB();

    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 },
      );
    }

    const normalizedEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: normalizedEmail }).select(
      "+resetPasswordToken +resetPasswordExpire",
    );

    if (!user) {
      return NextResponse.json(
        { success: true, message: GENERIC_MESSAGE },
        { status: 200 },
      );
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    const origin =
      process.env.NEXT_PUBLIC_APP_URL || new URL(request.url).origin;
    const resetUrl = `${origin}/reset-password?token=${resetToken}`;

    const emailResult = await sendPasswordResetEmail({
      to: user.email,
      resetUrl,
      userName: user.fullName,
      expiryMinutes: 10,
    });

    if (!emailResult.success) {
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });

      return NextResponse.json(
        {
          success: false,
          message: "Failed to send password reset email. Please try again.",
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { success: true, message: GENERIC_MESSAGE },
      { status: 200 },
    );
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
