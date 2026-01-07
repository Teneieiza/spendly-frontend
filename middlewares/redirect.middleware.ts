import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'

export function redirectMiddleware(req: NextRequest) {
  const { pathname } = req.nextUrl

  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
}
