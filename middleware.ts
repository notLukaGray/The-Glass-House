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
const ADMIN_PROTECTED_ROUTES = ["/admin", "/api/auth/setup"] as const;

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
        return NextResponse.redirect(loginUrl);
      }

      // Check token expiry
      if (typeof token.exp === "number" && token.exp < Date.now() / 1000) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (token.role !== "admin") {
        return new NextResponse(null, { status: 403 });
      }

      return NextResponse.next();
    }

    return NextResponse.next();
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}

export const config = {
  matcher: [
    // Admin routes that need protection
    "/admin/:path*",
    "/api/auth/setup/:path*",
  ],
};
