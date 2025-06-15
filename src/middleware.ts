import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

// List of Sanity Studio paths that should be handled by the studio
const SANITY_PATHS = [
  '/studio',
  '/structure',
  '/desk',
  '/tool',
  '/vision',
  '/media',
  '/assist',
  '/settings',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Check if the path starts with any of our Sanity paths
  const isSanityPath = SANITY_PATHS.some(path => pathname.startsWith(path))

  if (isSanityPath) {
    // Check authentication for Sanity Studio access
    const token = await getToken({ req: request, secret })
    if (!token || token.role !== 'admin') {
      // Redirect to login page if not admin
      return NextResponse.redirect(new URL('/login', request.url))
    }

    // Rewrite the URL to the studio catch-all route
    return NextResponse.rewrite(new URL('/studio/[[...index]]', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match all paths that start with our Sanity paths
    '/studio/:path*',
    '/structure/:path*',
    '/desk/:path*',
    '/tool/:path*',
    '/vision/:path*',
    '/media/:path*',
    '/assist/:path*',
    '/settings/:path*',
  ],
} 