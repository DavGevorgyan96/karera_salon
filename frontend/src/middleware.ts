import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Helper function to decode JWT token (simple base64 decode)
function decodeToken(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch {
    return null;
  }
}

// Routes that require ADMIN role only
const adminOnlyRoutes = [
  '/admin/settings',
  '/admin/users',
];

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Define paths that are protected
  if (path.startsWith('/admin')) {
    // Allow access to login page
    if (path === '/admin/login') {
      return NextResponse.next();
    }

    // Check for auth token in cookies
    const token = request.cookies.get('auth_token')?.value;

    if (!token) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Decode token to check role
    const payload = decodeToken(token);
    
    if (!payload || !payload.role) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    // Check if route requires ADMIN role
    const requiresAdmin = adminOnlyRoutes.some(route => path.startsWith(route));
    
    if (requiresAdmin && payload.role !== 'ADMIN') {
      // Redirect to dashboard if not admin
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    }

    // Check if user has access (ADMIN or MANAGER)
    if (payload.role !== 'ADMIN' && payload.role !== 'MANAGER') {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
