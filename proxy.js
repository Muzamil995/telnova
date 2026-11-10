import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes and verify authentication
 */
export async function proxy(request) {
  const { pathname, searchParams } = request.nextUrl;
  const host = request.headers.get("host") || "";
  const hostname = host.split(":")[0];
  const isLocalhost =
    hostname === "localhost" || /^\d+\.\d+\.\d+\.\d+$/.test(hostname);
  const sharedCookieDomain =
    process.env.NODE_ENV === "production" && !isLocalhost
      ? process.env.COOKIE_DOMAIN || `.${hostname.replace(/^www\./, "")}`
      : undefined;

  // Get token from cookie
  const token = request.cookies.get("token")?.value;

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/about",
    "/providers",
    "/faq",
    "/solutions/internet",
    "/solutions/tv",
    "/solutions/mobile",
    "/solutions/home-phone",
    "/solutions/home-security",
    "/v2",
    "/signin",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/privacy-policy",
    "/terms-and-conditions",
  ];
  const isPublicRoute = publicRoutes.includes(pathname);

  // Explicit logout marker: clear cookies on the current host before any redirect logic.
  if (searchParams.get("logged_out") === "1") {
    const cleanUrl = request.nextUrl.clone();
    cleanUrl.searchParams.delete("logged_out");

    const response = NextResponse.redirect(cleanUrl);
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
  }

  // If accessing a protected route without a token, redirect to signin
  if (!token && !isPublicRoute) {
    const url = request.nextUrl.clone();
    url.pathname = "/";
    url.searchParams.set("redirected", "true");
    return NextResponse.redirect(url);
  }

  // If has token, verify it
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Add user info to request headers for use in API routes
      const requestHeaders = new Headers(request.headers);
      requestHeaders.set("x-user-id", decoded.userId);
      requestHeaders.set("x-user-email", decoded.email);
      requestHeaders.set("x-user-role", decoded.role);

      // If authenticated user tries to access signin/signup, redirect to dashboard
      if (isPublicRoute && pathname === "/") {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      return NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      });
    } catch (error) {
      // Token is invalid or expired
      console.error("Token verification failed:", error.message);

      // Clear invalid token
      const response = NextResponse.redirect(new URL("/", request.url));
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
    }
  }

  return NextResponse.next();
}

/**
 * Configure which routes the middleware should run on
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - api routes (they handle their own auth)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$|api).*)",
  ],
};
