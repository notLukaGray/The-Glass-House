import { NextRequest, NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'

const secret = process.env.NEXTAUTH_SECRET

export async function middleware(req: NextRequest) {
  // Only protect /studio and subroutes
  if (req.nextUrl.pathname.startsWith('/studio')) {
    const token = await getToken({ req, secret })
    if (!token || token.role !== 'admin') {
      // Redirect to login page if not admin
      return NextResponse.redirect(new URL('/login', req.url))
    }
  }
  return NextResponse.next()
}

// Only run on /studio and its subroutes
export const config = {
  matcher: ['/studio/:path*'],
} 