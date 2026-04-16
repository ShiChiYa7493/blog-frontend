import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // In development or IP access, allow everything
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return NextResponse.next();
  }

  // blog.shichiya.cn → rewrite to /blog routes
  if (hostname.startsWith('blog.')) {
    // Root of blog subdomain → show blog homepage
    if (pathname === '/') {
      const url = request.nextUrl.clone();
      url.pathname = '/blog';
      return NextResponse.rewrite(url);
    }
    // /blog/* already correct
    if (pathname.startsWith('/blog')) {
      return NextResponse.next();
    }
    // /admin stays as-is on blog subdomain
    if (pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    // Other paths on blog subdomain → prepend /blog
    const url = request.nextUrl.clone();
    url.pathname = `/blog${pathname}`;
    return NextResponse.rewrite(url);
  }

  // shichiya.cn or www.shichiya.cn
  // Root → homepage (default, no rewrite needed since page.tsx is at root)
  if (pathname === '/') {
    return NextResponse.next();
  }

  // /blog/* allowed on main domain
  if (pathname.startsWith('/blog')) {
    return NextResponse.next();
  }

  // /admin allowed on main domain
  if (pathname.startsWith('/admin')) {
    return NextResponse.next();
  }

  // Future tool routes (e.g., /image2video) allowed on main domain
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
