import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // In development or IP access, allow everything
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return NextResponse.next();
  }

  // Skip static files in public/ (avatar.jpg, IMG_*.png, etc.). Without this,
  // requests to blog.shichiya.cn/avatar.jpg get rewritten to /blog/avatar.jpg
  // and 404. The /uploads matcher already excludes uploaded media.
  if (/\.[a-zA-Z0-9]{2,5}$/.test(pathname)) {
    return NextResponse.next();
  }

  // blog.shichiya.cn → rewrite to /blog routes
  if (hostname.startsWith('blog.')) {
    // /blog/* and /admin already correct on blog subdomain
    if (pathname.startsWith('/blog') || pathname.startsWith('/admin')) {
      return NextResponse.next();
    }
    // Force http protocol on the rewrite target. Next.js binds on http
    // (next start -H 127.0.0.1) but trusts X-Forwarded-Proto: https from
    // nginx, so its self-perceived origin becomes https://localhost:3000
    // — a non-existent endpoint, causing the rewrite fetch to 500.
    const url = request.nextUrl.clone();
    url.protocol = 'http:';
    url.pathname = pathname === '/' ? '/blog' : `/blog${pathname}`;
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
