import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import Ticket from "@/models/ticketModel";
import User from "@/models/userModel";

/**
 * GET /api/support/tickets/all
 * Fetch all support tickets (admin and operator only)
 * Query params: page, limit, status, priority, category
 */
export async function GET(request) {
  try {
    await connectToDB();

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
          message: "Forbidden - only admin or operator can access this",
        },
        { status: 403 },
      );
    }

    // Get query parameters for filtering and pagination
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status");
    const priority = searchParams.get("priority");
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    // Build filter object
    const filter = {};
    if (status) filter.status = status;
    if (priority) filter.priority = priority;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { ticketNumber: { $regex: search, $options: "i" } },
        { userEmail: { $regex: search, $options: "i" } },
        { userName: { $regex: search, $options: "i" } },
        { category: { $regex: search, $options: "i" } },
      ];
    }

    // Calculate skip for pagination
    const skip = (page - 1) * limit;

    // Execute query with filters, sorting, and pagination
    const tickets = await Ticket.find(filter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select(
        "ticketNumber category priority status userEmail userName createdAt updatedAt userId resolvedBy",
      )
      .populate("userId", "phoneNumber")
      .populate("resolvedBy", "fullName");

    // Get total count for pagination
    const totalCount = await Ticket.countDocuments(filter);
    const totalPages = Math.ceil(totalCount / limit);

    // Format response
    const formattedTickets = tickets.map((ticket) => ({
      ticketNumber: ticket.ticketNumber,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      userEmail: ticket.userEmail,
      userName: ticket.userName,
      userPhoneNumber: ticket.userId?.phoneNumber || null,
      resolvedBy: ticket.resolvedBy?.fullName || null,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
    }));

    return NextResponse.json({
      success: true,
      tickets: formattedTickets,
      pagination: {
        currentPage: page,
        totalPages: totalPages,
        totalCount: totalCount,
        limit: limit,
      },
    });
  } catch (error) {
    console.error("Fetch all tickets error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tickets",
      },
      { status: 500 },
    );
  }
}
