import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // 1. Protected routes (Auth required)
  const protectedRoutes = ['/today', '/focus', '/tasks', '/progress', '/settings', '/onboarding'];
  const isProtectedRoute = protectedRoutes.some(r => pathname.startsWith(r));

  if (!user && isProtectedRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  // 2. Email Verification Gate
  // If user is logged in but not confirmed, and trying to access app/onboarding
  if (user && !user.email_confirmed_at && isProtectedRoute && pathname !== '/verify-email') {
    return NextResponse.redirect(new URL('/verify-email', request.url));
  }

  // 3. Auth pages (Redirect if already logged in)
  const authRoutes = ['/sign-in', '/sign-up', '/verify-email'];
  if (user && authRoutes.includes(pathname) && user.email_confirmed_at) {
     return NextResponse.redirect(new URL('/today', request.url));
  }

  return supabaseResponse;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|api/stripe).*)'],
};
