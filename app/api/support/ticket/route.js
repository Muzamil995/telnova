import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectToDB } from "@/configs/database";
import Ticket from "@/models/ticketModel";
import User from "@/models/userModel";

const CATEGORY_KEYWORDS = {
  "Internet/Connectivity Issues": [
    "internet",
    "connection",
    "wifi",
    "network",
    "speed",
    "outage",
    "down",
    "slow",
    "disconnect",
  ],
  "TV Service Issues": [
    "tv",
    "television",
    "channel",
    "picture",
    "guide",
    "receiver",
    "streaming",
    "app",
  ],
  "Mobile Service Issues": [
    "mobile",
    "cell",
    "phone",
    "data",
    "signal",
    "calls",
    "voicemail",
    "sim",
    "esim",
  ],
  "Billing & Payments": [
    "bill",
    "payment",
    "charge",
    "invoice",
    "pricing",
    "discount",
    "promo",
    "credit",
  ],
  "Installation & Technician": [
    "install",
    "technician",
    "appointment",
    "visit",
    "schedule",
    "wiring",
  ],
  "Equipment & Hardware": [
    "modem",
    "router",
    "device",
    "equipment",
    "box",
    "remote",
    "hardware",
    "replacement",
  ],
  "Account Management": [
    "account",
    "transfer",
    "cancel",
    "move",
    "address",
    "holder",
    "verification",
  ],
  "Service Changes": [
    "upgrade",
    "downgrade",
    "package",
    "plan",
    "subscribe",
    "add",
    "remove",
    "change",
  ],
};

function detectCategory(conversationHistory) {
  const allMessages = conversationHistory
    .filter((msg) => msg.role === "user")
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  const categoryScores = {};

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, "gi");
      const matches = allMessages.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
    categoryScores[category] = score;
  }

  const bestCategory = Object.keys(categoryScores).reduce((a, b) =>
    categoryScores[a] > categoryScores[b] ? a : b,
  );

  return categoryScores[bestCategory] > 0 ? bestCategory : "Other";
}

function detectPriority(category, conversationHistory) {
  const urgentKeywords = [
    "urgent",
    "emergency",
    "critical",
    "immediately",
    "asap",
    "down",
    "outage",
    "not working",
  ];
  const highKeywords = [
    "important",
    "soon",
    "quickly",
    "hours",
    "problem",
    "issue",
  ];

  const allMessages = conversationHistory
    .map((msg) => msg.content.toLowerCase())
    .join(" ");

  for (const keyword of urgentKeywords) {
    if (allMessages.includes(keyword)) {
      return "urgent";
    }
  }

  for (const keyword of highKeywords) {
    if (allMessages.includes(keyword)) {
      return "high";
    }
  }

  if (
    category === "Internet/Connectivity Issues" ||
    category === "Billing & Payments"
  ) {
    return "high";
  }

  return "medium";
}

export async function POST(request) {
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

    const user = await User.findById(decoded.userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      );
    }

    const body = await request.json();
    const { conversationHistory } = body;

    if (!conversationHistory || !Array.isArray(conversationHistory)) {
      return NextResponse.json(
        { success: false, message: "Conversation history is required" },
        { status: 400 },
      );
    }

    if (conversationHistory.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "Conversation history cannot be empty",
        },
        { status: 400 },
      );
    }

    const category = detectCategory(conversationHistory);
    const priority = detectPriority(category, conversationHistory);

    // Generate ticket number
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const timestamp = Date.now().toString().slice(-7);
    const ticketNumber = `TN${year}${month}${timestamp}`;

    const ticket = new Ticket({
      ticketNumber,
      userId: user._id,
      userEmail: user.email,
      userName: user.fullName,
      conversationHistory: conversationHistory.map((msg) => ({
        role: msg.role,
        content: msg.content,
        timestamp: msg.timestamp || new Date(),
      })),
      category,
      priority,
      status: "open",
    });

    await ticket.save();

    return NextResponse.json(
      {
        success: true,
        ticket: {
          ticketNumber: ticket.ticketNumber,
          category: ticket.category,
          priority: ticket.priority,
          status: ticket.status,
          createdAt: ticket.createdAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Create ticket error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to create support ticket",
      },
      { status: 500 },
    );
  }
}

/**
 * GET /api/support/ticket
 * Fetch tickets for authenticated user
 * Query params: limit (default: all, use limit=4 for recent)
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

    // Get limit from query params (for recent tickets)
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get("limit");

    // Build query
    let query = Ticket.find({ userId: user._id }).sort({ createdAt: -1 });

    // Apply limit if specified
    if (limit) {
      query = query.limit(parseInt(limit, 10));
    }

    // Execute query
    const tickets = await query.select(
      "ticketNumber category priority status createdAt updatedAt resolution",
    );

    // Format response
    const formattedTickets = tickets.map((ticket) => ({
      ticketNumber: ticket.ticketNumber,
      category: ticket.category,
      priority: ticket.priority,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      resolution: ticket.resolution,
    }));

    return NextResponse.json({
      success: true,
      tickets: formattedTickets,
      count: formattedTickets.length,
    });
  } catch (error) {
    console.error("Fetch tickets error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch tickets",
      },
      { status: 500 },
    );
  }
}
