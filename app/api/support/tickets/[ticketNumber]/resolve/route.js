import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import Ticket from "@/models/ticketModel";
import User from "@/models/userModel";

/**
 * PATCH /api/support/tickets/[ticketNumber]/resolve
 * Mark a ticket as resolved (admin and operator only)
 */
export async function PATCH(request, { params }) {
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
          message: "Forbidden - only admin or operator can resolve tickets",
        },
        { status: 403 },
      );
    }

    // Find and update ticket
    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return NextResponse.json(
        { success: false, message: "Ticket not found" },
        { status: 404 },
      );
    }

    // Update ticket status and resolved details
    ticket.status = "resolved";
    ticket.resolvedAt = new Date();
    ticket.resolvedBy = user._id;
    await ticket.save();

    return NextResponse.json({
      success: true,
      message: "Ticket marked as resolved successfully",
      ticket: {
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        resolvedAt: ticket.resolvedAt,
        resolvedBy: user._id,
      },
    });
  } catch (error) {
    console.error("Mark ticket as resolved error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to mark ticket as resolved",
      },
      { status: 500 },
    );
  }
}
