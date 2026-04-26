import NextAuth from 'next-auth'
import { authConfig } from '@/lib/auth/config'
import { NextResponse } from 'next/server'

export default NextAuth(authConfig).auth((req) => {
  const { pathname } = req.nextUrl
  const isLoggedIn = !!req.auth
  const isAdmin = req.auth?.user?.role === 'ADMIN'

  // Admin koruması
  if (pathname.startsWith('/admin')) {
    if (!isLoggedIn) {
      return NextResponse.redirect(new URL('/giris?callbackUrl=/admin', req.url))
    }
    if (!isAdmin) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  // Hesabım koruması
  if (pathname.startsWith('/hesabim') && !isLoggedIn) {
    return NextResponse.redirect(new URL(`/giris?callbackUrl=${pathname}`, req.url))
  }

  return NextResponse.next()
})

export const config = {
  matcher: ['/admin/:path*', '/hesabim/:path*'],
}
