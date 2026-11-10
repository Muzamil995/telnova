import { NextResponse } from "next/server";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";
import { createOTP } from "@/utils/otp";
import { sendOTPEmail } from "@/services/emailService";
import { sendOTPSMS } from "@/services/smsService";

export async function POST(request) {
  try {
    await connectToDB();

    const {
      fullName,
      email,
      password,
      phoneNumber,
      verificationType = "phone", // 'phone' or 'email' - default to phone
    } = await request.json();

    // Validate required fields
    if (!fullName || !email || !password || !phoneNumber) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 },
      );
    }

    // Validate phone number format (E.164)
    const phoneRegex = /^\+?[1-9]\d{1,14}$/;
    if (!phoneRegex.test(phoneNumber)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Invalid phone number format. Use E.164 format (e.g., +1234567890)",
        },
        { status: 400 },
      );
    }

    // Check if user already exists with email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return NextResponse.json(
        { success: false, message: "Email already registered" },
        { status: 409 },
      );
    }

    // Check if user already exists with phone number
    const existingUserByPhone = await User.findOne({ phoneNumber });
    if (existingUserByPhone) {
      return NextResponse.json(
        { success: false, message: "Phone number already registered" },
        { status: 409 },
      );
    }

    // Validate verificationType
    if (!["email", "phone"].includes(verificationType)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid verification type. Must be 'email' or 'phone'",
        },
        { status: 400 },
      );
    }

    // Create new user
    const user = await User.create({
      fullName,
      email,
      password,
      phoneNumber,
    });

    // Generate and send OTP based on verification type
    const otpResult = await createOTP({
      userId: user._id,
      email: verificationType === "email" ? user.email : undefined,
      phoneNumber: verificationType === "phone" ? user.phoneNumber : undefined,
      type: verificationType,
      purpose: "verification",
      expiryMinutes: 5,
    });

    let sendResult;
    let deliveryMessage;

    if (verificationType === "email") {
      // Send OTP via email
      sendResult = await sendOTPEmail({
        to: user.email,
        otp: otpResult.otp,
        userName: user.fullName,
        expiryMinutes: 5,
      });
      deliveryMessage = "Please check your email for verification code.";
    } else {
      // Send OTP via SMS
      sendResult = await sendOTPSMS({
        to: user.phoneNumber,
        otp: otpResult.otp,
        userName: user.fullName,
        expiryMinutes: 5,
      });
      deliveryMessage = "Please check your phone for verification code.";
    }

    if (!sendResult.success) {
      console.error(
        `Failed to send OTP via ${verificationType}:`,
        sendResult.message,
      );

      // Delete the created user if OTP sending fails
      await User.findByIdAndDelete(user._id);

      return NextResponse.json(
        {
          success: false,
          message: `Failed to send verification code. ${sendResult.message}. Please try again.`,
        },
        { status: 500 },
      );
    }

    // Return user data without password
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

    return NextResponse.json(
      {
        success: true,
        message: `User registered successfully. ${deliveryMessage}`,
        user: userResponse,
        requiresVerification: true,
        verificationType: verificationType,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Signup error:", error);

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((err) => err.message);
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
