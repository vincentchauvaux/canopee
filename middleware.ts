import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import { getClientIp, rateLimit } from "@/lib/rate-limit";
import { isSuspiciousPath } from "@/lib/security-paths";

function applySecurityHeaders(response: NextResponse) {
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );
  response.headers.set("X-XSS-Protection", "0");
  return response;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const method = request.method.toUpperCase();

  // Bloquer les scans d'intrusion (WordPress, PHP, .env, etc.)
  if (isSuspiciousPath(pathname)) {
    return applySecurityHeaders(
      new NextResponse(null, { status: 404 }),
    );
  }

  const ip = getClientIp(request);

  // Rate limit agressif sur authentification / inscription
  if (
    method === "POST" &&
    (pathname === "/api/auth/callback/credentials" ||
      pathname === "/api/auth/signin/email" ||
      pathname === "/api/auth/register" ||
      pathname.startsWith("/api/auth/callback/"))
  ) {
    const authLimit = rateLimit(`auth:${ip}`, 20, 15 * 60 * 1000);
    if (!authLimit.ok) {
      const res = NextResponse.json(
        { error: "Trop de tentatives. Réessayez plus tard." },
        { status: 429 },
      );
      res.headers.set("Retry-After", String(authLimit.retryAfterSec));
      return applySecurityHeaders(res);
    }
  }

  // Rate limit général API (anti-scan / DoS léger)
  if (pathname.startsWith("/api/")) {
    const apiLimit = rateLimit(`api:${ip}`, 180, 60 * 1000);
    if (!apiLimit.ok) {
      const res = NextResponse.json(
        { error: "Trop de requêtes. Réessayez plus tard." },
        { status: 429 },
      );
      res.headers.set("Retry-After", String(apiLimit.retryAfterSec));
      return applySecurityHeaders(res);
    }
  }

  // Protéger les pages admin : session + rôle admin
  if (pathname.startsWith("/admin")) {
    // Même nom de cookie que lib/auth.ts (next-auth.session-token + secure en prod)
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
      cookieName: "next-auth.session-token",
    });

    if (!token) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", pathname);
      return applySecurityHeaders(NextResponse.redirect(signInUrl));
    }

    if (token.role !== "admin") {
      return applySecurityHeaders(
        NextResponse.redirect(new URL("/", request.url)),
      );
    }
  }

  return applySecurityHeaders(NextResponse.next());
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/:path*",
    "/((?!_next/static|_next/image|favicon.ico|audio/|images/|icon.png|apple-icon.png).*)",
  ],
};
