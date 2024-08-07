import { NextResponse } from 'next/server'

export function middleware(req) {
  const token = req.cookies.get('jwt')
  console.log('Token:', token) // Debugging: Check if token is correctly retrieved

  if (!token && req.nextUrl.pathname !== '/auth/login' && req.nextUrl.pathname !== '/auth/signup') {
    console.log('Redirecting to login') // Debugging: Confirm redirection logic
    return NextResponse.redirect(new URL('/auth/login', req.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
