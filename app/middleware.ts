// middleware.ts (at your project root, same level as app/)
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const response = NextResponse.next()

  if (process.env.NODE_ENV !== 'production') {
    response.headers.set('x-forwarded-host', request.headers.get('host') ?? '')
  }

  return response
}