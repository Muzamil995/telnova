import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";
import { connectToDB } from "@/configs/database";
import User from "@/models/userModel";

export async function requireAuthenticatedUser(
  request,
  {
    allowedRoles = [],
    select = "_id fullName email role isActive createdAt phoneNumber",
    lean = true,
  } = {},
) {
  await connectToDB();

  const token = request.cookies.get("token")?.value;

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  let decoded;

  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: "Invalid token" },
        { status: 401 },
      ),
    };
  }

  const userQuery = User.findById(decoded.userId).select(select);
  const user = lean ? await userQuery.lean() : await userQuery;

  if (!user) {
    return {
      error: NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 },
      ),
    };
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return {
      error: NextResponse.json(
        { success: false, message: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  return { user };
}
