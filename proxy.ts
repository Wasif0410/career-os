import { NextResponse, type NextRequest } from "next/server";
import { BASIC_AUTH_CHALLENGE, hasValidPassword } from "@/lib/auth/basic-auth";

/**
 * Puts a password in front of the student app when APP_PASSWORD is set.
 * Without it, requests pass through: the app runs open locally and on previews,
 * and 404s in production (see lib/auth/current-user.ts).
 */
export function proxy(request: NextRequest) {
  const password = process.env.APP_PASSWORD;
  if (!password || hasValidPassword(request.headers.get("authorization"), password)) return NextResponse.next();
  return new NextResponse("Password required.", {
    status: 401,
    headers: { "WWW-Authenticate": BASIC_AUTH_CHALLENGE, "Cache-Control": "no-store" },
  });
}

// Every student app route. A test checks this stays in step with the sidebar in components/app/nav-items.ts.
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/resume/:path*",
    "/coaching/:path*",
    "/plan/:path*",
    "/courses/:path*",
    "/jobs/:path*",
    "/applications/:path*",
    "/profile/:path*",
    "/billing/:path*",
  ],
};
