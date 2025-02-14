import { type NextRequest, NextResponse } from "next/server";
import { COOKIE_ACCESS_TOKEN } from "./constant";

export function middleware(req: NextRequest) {
  const token = req.cookies.get(COOKIE_ACCESS_TOKEN);
  const isAuthenticated = !!token;
  const { pathname } = req.nextUrl;
  const isAuthPage = pathname.startsWith("/login");

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  if (!isAuthenticated && pathname.startsWith("/dashboard")) {
    let from = req.nextUrl.pathname;
    if (req.nextUrl.search) {
      from += req.nextUrl.search;
    }

    return NextResponse.redirect(
      new URL(`/login?from=${encodeURIComponent(from)}`, req.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
