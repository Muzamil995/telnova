import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { verifyOTP } from "@/utils/otp";
import { sendWelcomeEmail } from "@/services/emailService";

export async function POST(request) {
  try {
    await connectToDB();

    const {
      userId,
      email,
      otp,
      type = "email",
      phoneMethod = "sms",
    } = await request.json();

    // Validate required fields
    if (!userId || !otp) {
      return NextResponse.json(
        { success: false, message: "User ID and OTP are required" },
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

    // Verify OTP
    const verificationResult = await verifyOTP({
      userId: user._id,
      otp,
      type,
      purpose: "verification",
    });

    if (!verificationResult.success) {
      return NextResponse.json(
        {
          success: false,
          message: verificationResult.message,
        },
        { status: 400 },
      );
    }

    // Update user verification status
    if (type === "email") {
      user.emailVerified = true;

      // Send welcome email (don't block on this)
      sendWelcomeEmail({
        to: user.email,
        userName: user.fullName,
      }).catch((error) =>
        console.error("Failed to send welcome email:", error),
      );
    } else if (type === "phone") {
      user.phoneVerified = true;
    }

    // Activate user account if either email or phone is verified
    if (user.emailVerified || user.phoneVerified) {
      user.isActive = true;
    }

    await user.save();

    // Return updated user data without password
    const userResponse = {
      _id: user._id,
      fullName: user.fullName,
      email: user.email,
      emailVerified: user.emailVerified,
      phoneNumber: user.phoneNumber,
      phoneVerified: user.phoneVerified,
      role: user.role,
      subscription: user.subscription,
      isActive: user.isActive,
      createdAt: user.createdAt,
    };

    // Issue login token after successful verification so protected routes work immediately.
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    const response = NextResponse.json(
      {
        success: true,
        message: `${type === "email" ? "Email" : "Phone"} verified successfully`,
        user: userResponse,
        token,
      },
      { status: 200 },
    );

    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const isLocalhost =
      hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    const sharedCookieDomain =
      process.env.NODE_ENV === "production" && !isLocalhost
        ? process.env.COOKIE_DOMAIN || `.${hostname.replace(/^www\./, "")}`
        : undefined;

    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60,
      path: "/",
      domain: sharedCookieDomain,
    });

    return response;
  } catch (error) {
    console.error("Verify OTP error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
