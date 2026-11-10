import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import Ticket from "@/models/ticketModel";
import User from "@/models/userModel";

/**
 * GET /api/support/tickets/[ticketNumber]/details
 * Fetch a single ticket details by ticket number for admin/operator with full conversation
 */
export async function GET(request, { params }) {
  try {
    await connectToDB();

    const { ticketNumber } = await params;

    if (!ticketNumber) {
      return NextResponse.json(
        { success: false, message: "Ticket number is required" },
        { status: 400 },
      );
    }

    // Get JWT token from cookies
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      );
    }

    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      );
    }

    // Get authenticated user
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    // Check if user is admin or operator
    if (!["admin", "operator"].includes(user.role)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Forbidden - only admin or operator can access ticket details",
        },
        { status: 403 },
      );
    }

    // Fetch the specific ticket
    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 },
      );
    }

    // Format response with all ticket details including conversation
    const ticketDetails = {
      ticketNumber: ticket.ticketNumber,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      userEmail: ticket.userEmail,
      userName: ticket.userName,
      conversationHistory: ticket.conversationHistory || [],
      resolvedAt: ticket.resolvedAt,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    };

    return NextResponse.json({
      success: true,
      ticket: ticketDetails,
    });
  } catch (error) {
    console.error("Fetch ticket details error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch ticket details",
      },
      { status: 500 },
    );
  }
}
