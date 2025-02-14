import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN } from "./constant";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_ACCESS_TOKEN);
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (isAuthenticated && pathname.startsWith("/login")) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
