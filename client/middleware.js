import { NextResponse } from "next/server";

export function middleware(req) {
  const token = req.cookies.get("token")?.value;
  const pathname = req.nextUrl.pathname;

  // ✅ LOGIN PAGE HAMESHA ALLOW
  if (pathname === "/admin/login") {
    return NextResponse.next();
  }

  // 🔒 ADMIN DASHBOARD PROTECTION
  if (pathname.startsWith("/admin/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
