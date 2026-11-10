import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";

/**
 * GET /api/admin/stats
 * Returns user totals and paid-plan breakdown from the database.
 * Restricted to admin role — verified via JWT cookie.
 */
export async function GET(request) {
  try {
    await connectToDB();

    const token = request.cookies.get("token")?.value;
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 },
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const authUser = await User.findById(decoded.userId).select("role").lean();
    if (!authUser || authUser.role !== "admin") {
      return NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      );
    }

    const [
      totalUsers,
      totalSubscribedUsers,
      totalMonthlyPlanUsers,
      totalYearlyPlanUsers,
      totalLifetimePlanUsers,
    ] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({
        "subscription.plan": { $in: ["monthly", "yearly", "lifetime"] },
      }),
      User.countDocuments({
        "subscription.plan": "monthly",
      }),
      User.countDocuments({
        "subscription.plan": "yearly",
      }),
      User.countDocuments({
        "subscription.plan": "lifetime",
      }),
    ]);

    return NextResponse.json({
      success: true,
      totalUsers,
      totalSubscribedUsers,
      totalMonthlyPlanUsers,
      totalYearlyPlanUsers,
      totalLifetimePlanUsers,
    });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch stats" },
      { status: 500 },
    );
  }
}
