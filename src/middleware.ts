import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getAuthConfig } from "@/lib/env";

// Validate environment on middleware load
const authConfig = getAuthConfig();

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

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  try {
    const isSanityPath = SANITY_PATHS.some((path) => pathname.startsWith(path));

    if (isSanityPath) {
      const token = await getToken({ req: request, secret: authConfig.secret });

      if (!token) {
        const loginUrl = new URL("/login", request.url);
        loginUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(loginUrl);
      }

      if (token.role !== "admin") {
        return new NextResponse(null, { status: 403 });
      }

      return NextResponse.rewrite(new URL("/studio/[[...index]]", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return new NextResponse(null, { status: 500 });
  }
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|studio).*)"],
};
