import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

// The middleware relies on the NEXTAUTH_SECRET to decrypt the JWT.
// This check ensures the application fails fast during development if the secret is missing.
if (!process.env.NEXTAUTH_SECRET) {
  throw new Error(
    "NEXTAUTH_SECRET is not set in the environment. This is required for authentication.",
  );
}

const secret = process.env.NEXTAUTH_SECRET;

// These are the top-level paths used by Sanity Studio v3.
// Any request starting with one of these will be treated as a studio request.
const SANITY_PATHS = [
  "/studio",
  "/structure",
  "/desk",
  "/tool",
  "/vision",
  "/media",
  "/assist",
  "/settings",
] as const;

/**
 * The primary middleware for the application. It has two main jobs:
 * 1. Protect the Sanity Studio routes, ensuring only authenticated admins can access them.
 * 2. Rewrite requests for Sanity Studio to the correct internal Next.js route.
 *
 * @param request The incoming Next.js request object.
 */
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // IMPORTANT: We explicitly skip all API routes at the beginning.
  // This prevents the middleware from interfering with NextAuth's own API calls
  // (e.g., /api/auth/session), which could cause infinite redirects or other errors.
  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
    // Check if the request is for a Sanity Studio path.
    const isSanityPath = SANITY_PATHS.some((path) => pathname.startsWith(path));

    if (isSanityPath) {
      // If it's a studio path, we must verify the user's session.
      const token = await getToken({ req: request, secret });

      // If there's no token, the user is not logged in. Redirect them to the
      // login page, and include a `callbackUrl` so they're sent back here after success.
      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      // Even if logged in, only users with the 'admin' role can access the studio.
      // If they don't have the role, we deny access with a "Forbidden" status.
      if (token.role !== "admin") {
        return new NextResponse(null, { status: 403 });
      }

      // If the user is an authenticated admin, we rewrite the URL.
      // This keeps the Sanity URL in the browser bar but serves the content
      // from Next.js's internal ` /studio/[[...index]]` route.
      return NextResponse.rewrite(new URL("/studio/[[...index]]", request.url));
    }

    // If the path is not a Sanity path, let the request proceed as normal.
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    // On unexpected errors, prevent the app from crashing and return a generic server error.
    return new NextResponse(null, { status: 500 });
  }
}

// The `matcher` provides a performance boost by ensuring the middleware only
// runs on requests that it actually needs to inspect. While the function
// also has logic to skip `/api/` routes, this prevents the middleware
// function from even executing on those requests.
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - studio (Sanity Studio routes - handled separately)
     *
     * This is a more efficient approach than listing every path to include.
     */
    "/((?!_next/static|_next/image|favicon.ico|studio).*)",
  ],
};
