import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  // Example: no-op now. Could restrict /admin by referer/IP etc.
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next|.*\..*).*)']
};
