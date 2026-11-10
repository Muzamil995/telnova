import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";

export async function POST(request) {
  try {
    await connectToDB();

    const { email, password } = await request.json();

    // Validate required fields
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: "Email and password are required" },
        { status: 400 },
      );
    }

    // Find user and include password field
    const user = await User.findOne({ email }).select("+password");

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Invalid email or password" },
        { status: 401 },
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE || "7d" },
    );

    // Prepare user response without password
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

    // Create response with HTTP-only cookie
    const response = NextResponse.json(
      {
        success: true,
        message: "Login successful",
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

    // Set HTTP-only cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days
      path: "/",
      domain: sharedCookieDomain,
    });

    return response;
  } catch (error) {
    console.error("Signin error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
