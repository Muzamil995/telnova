import { NextResponse } from "next/server";
import { requireAuthenticatedUser } from "@/lib/server-auth";

export async function PATCH(request) {
  try {
    const { user, error } = await requireAuthenticatedUser(request, {
      allowedRoles: ["partner"],
      select: "_id role +password",
      lean: false,
    });

    if (error) {
      return error;
    }

    const { currentPassword, newPassword } = await request.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        {
          success: false,
          message: "Current password and new password are required",
        },
        { status: 400 },
      );
    }

    const isCurrentPasswordValid = await user.comparePassword(currentPassword);

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 },
      );
    }

    const isSamePassword = await user.comparePassword(newPassword);

    if (isSamePassword) {
      return NextResponse.json(
        {
          success: false,
          message: "New password must be different from your current password",
        },
        { status: 400 },
      );
    }

    user.password = newPassword;
    await user.save();

    return NextResponse.json({
      success: true,
      message: "Password updated successfully",
    });
  } catch (error) {
    console.error("Change partner password error:", error);

    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors || {}).map(
        (item) => item.message,
      );
      return NextResponse.json(
        { success: false, message: messages.join(", ") },
        { status: 400 },
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to update password" },
      { status: 500 },
    );
  }
}
