import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const { pathname } = req.nextUrl;

  /* ================= ALWAYS ALLOW LOGIN ================= */
  if (pathname.startsWith("/admin/login")) {
    return NextResponse.next();
  }

  /* ================= IGNORE NEXT / STATIC FILES ================= */
  if (
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon.ico") ||
    pathname.startsWith("/images")
  ) {
    return NextResponse.next();
  }

  /* ================= PROTECT DASHBOARD ================= */
  if (pathname.startsWith("/admin/dashboard")) {
    // ⚠️ Soft guard: sirf token existence check
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      loginUrl.searchParams.set("redirect", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
