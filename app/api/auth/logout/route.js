import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const host = request.headers.get("host") || "";
    const hostname = host.split(":")[0];
    const isLocalhost =
      hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
    const sharedCookieDomain =
      process.env.NODE_ENV === "production" && !isLocalhost
        ? process.env.COOKIE_DOMAIN || `.${hostname.replace(/^www\./, "")}`
        : undefined;

    // Create response
    const response = NextResponse.json(
      {
        success: true,
        message: "Logged out successfully",
      },
      { status: 200 },
    );

    // Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    if (sharedCookieDomain) {
      response.cookies.set("token", "", {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: 0,
        path: "/",
        domain: sharedCookieDomain,
      });
    }

    return response;
  } catch (error) {
    console.error("Logout error:", error);

    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
