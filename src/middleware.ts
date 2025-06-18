import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

if (!process.env.NEXTAUTH_SECRET) {
  throw new Error('NEXTAUTH_SECRET is not defined')
}

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
] as const

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl

    // Check if the path starts with any of our Sanity paths
    const isSanityPath = SANITY_PATHS.some(path => pathname.startsWith(path))

    if (isSanityPath) {
      // Check authentication for Sanity Studio access
      const token = await getToken({ req: request, secret })
      
      if (!token) {
        // Redirect to login page if not authenticated
        return NextResponse.redirect(new URL('/login', request.url))
      }

      if (token.role !== 'admin') {
        // Return 403 Forbidden if not admin
        return new NextResponse(null, { status: 403 })
      }

      // Rewrite the URL to the studio catch-all route
      return NextResponse.rewrite(new URL('/studio/[[...index]]', request.url))
    }

    return NextResponse.next()
  } catch (error) {
    console.error('Middleware error:', error)
    // Return 500 Internal Server Error on unexpected errors
    return new NextResponse(null, { status: 500 })
  }
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