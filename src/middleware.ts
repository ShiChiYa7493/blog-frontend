import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;

  // In development or IP access, allow everything
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1') || /^\d+\.\d+\.\d+\.\d+/.test(hostname)) {
    return NextResponse.next();
  }

  // blog.shichiya.com → serve blog routes (existing behavior)
  if (hostname.startsWith('blog.')) {
    // If someone visits blog.shichiya.com/home, redirect to blog root
    if (pathname.startsWith('/home')) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // shichiya.com or www.shichiya.com → serve homepage
  // Root path → rewrite to /home
  if (pathname === '/') {
    return NextResponse.rewrite(new URL('/home', request.url));
  }

  // /home/* routes are allowed on main domain
  if (pathname.startsWith('/home')) {
    return NextResponse.next();
  }

  // Future tool routes on shichiya.com (e.g., /image2video) are allowed
  // Blog-specific routes on main domain → redirect to blog subdomain
  const blogRoutes = ['/posts', '/categories', '/tags', '/archives', '/search', '/admin'];
  if (blogRoutes.some(route => pathname.startsWith(route))) {
    const blogUrl = new URL(pathname, request.url);
    blogUrl.hostname = `blog.${hostname.replace('www.', '')}`;
    return NextResponse.redirect(blogUrl);
  }

  // Everything else (like /about) → allow on main domain
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api
    '/((?!api|_next/static|_next/image|favicon.ico|uploads).*)',
  ],
};
