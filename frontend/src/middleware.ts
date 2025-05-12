// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("auth_token")?.value;
  const { pathname } = req.nextUrl;

  if (!token && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/signin", req.url));
  }

  // Logged in and trying to access signin/signup => redirect to dashboard
  if (token && (pathname === "/signin" || pathname === "/signup/select-role")) {
    console.log("loggin alreawdy ");
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/signin", "/signup/:path*"],
};
