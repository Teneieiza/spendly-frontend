import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from '@/auth'

const PROTECTED_ROUTES = ['/dashboard', '/expense', '/overall', '/setting']

export async function authMiddleware(req: NextRequest) {
  const session = await auth()
  const { pathname } = req.nextUrl

  const isProtected = PROTECTED_ROUTES.some((route) =>
    pathname.startsWith(route),
  )

  if (!session && isProtected) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }
}
