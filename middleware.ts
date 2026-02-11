import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  
  // This is a simple mock authentication check
  // In a real app, you would verify a JWT or session cookie
  const isAuthenticated = request.cookies.get('auth_logged_in');
  const isAdmin = request.cookies.get('admin_mode');

  if (path.startsWith('/admin')) {
    if (!isAuthenticated) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    if (!isAdmin) {
       return NextResponse.redirect(new URL('/dashboard', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/checkout/:path*'],
};
