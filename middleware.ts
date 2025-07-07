import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET is not set in the environment. This is required for authentication.",
  );
}

const secret = process.env.NEXTAUTH_SECRET;

// Routes that require admin authentication
const ADMIN_PROTECTED_ROUTES = [
  "/admin",
  "/api/auth/setup",
  "/studio",
  "/structure",
  "/desk",
  "/tool",
  "/vision",
  "/media",
  "/assist",
  "/settings",
] as const;

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip API routes that don't need admin protection
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth/setup")) {
    return NextResponse.next();
  }

  try {
    const isAdminRoute = ADMIN_PROTECTED_ROUTES.some((route) =>
      pathname.startsWith(route),
    );

    if (isAdminRoute) {
      const token = await getToken({ req: request, secret });

      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.headers.set("x-middleware-debug", "no-token");
        return response;
      }

      // Check token expiry
      if (typeof token.exp === "number" && token.exp < Date.now() / 1000) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        const response = NextResponse.redirect(loginUrl);
        response.headers.set("x-middleware-debug", "token-expired");
        return response;
      }

      if (token.role !== "admin") {
        const response = new NextResponse(null, { status: 403 });
        response.headers.set("x-middleware-debug", "not-admin");
        return response;
      }

      const response = NextResponse.next();
      response.headers.set("x-middleware-debug", "admin-ok");
      return response;
    }

    return NextResponse.next();
  } catch {
    const response = new NextResponse(null, { status: 500 });
    response.headers.set("x-middleware-debug", "error");
    return response;
  }
}

export const config = {
  matcher: [
    // Admin and Sanity Studio routes that need protection
    "/admin/:path*",
    "/api/auth/setup/:path*",
    "/studio/:path*",
    "/structure/:path*",
    "/desk/:path*",
    "/tool/:path*",
    "/vision/:path*",
    "/media/:path*",
    "/assist/:path*",
    "/settings/:path*",
  ],
};
