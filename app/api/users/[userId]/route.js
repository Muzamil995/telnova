import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";

export async function PATCH(request, { params }) {
  try {
    await connectToDB();

    const { userId } = await params;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 },
      );
    }

    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    const authUser = await User.findById(decoded.userId).select("role").lean();

    if (!authUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    if (authUser.role !== "admin") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden - only admin can update users",
        },
        { status: 403 },
      );
    }

    const body = await request.json();
    const { role, isActive, subscription } = body;

    const updateData = {};

    if (role !== undefined) {
      const validRoles = ["user", "operator", "partner", "admin"];
      if (!validRoles.includes(role)) {
        return NextResponse.json(
          { success: false, message: "Invalid role" },
          { status: 400 },
        );
      }
      updateData.role = role;
    }

    if (isActive !== undefined) {
      updateData.isActive = Boolean(isActive);
    }

    if (subscription !== undefined) {
      const validPlans = ["free", "monthly", "yearly", "lifetime"];
      if (subscription.plan && !validPlans.includes(subscription.plan)) {
        return NextResponse.json(
          { success: false, message: "Invalid plan" },
          { status: 400 },
        );
      }
      updateData.subscription = {
        ...subscription,
      };
    }

    const updatedUser = await User.findByIdAndUpdate(userId, updateData, {
      new: true,
      runValidators: false,
    }).select(
      "fullName email phoneNumber role isActive emailVerified phoneVerified subscription.plan subscription.status createdAt",
    );

    if (!updatedUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: updatedUser,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Update user error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
      },
      { status: 500 },
    );
  }
}
