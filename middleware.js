import { NextResponse } from "next/server";

/**
 * Strip legacy `.he` suffix from public routes (Israeli product archive paths).
 * Admin routes are untouched — no pages/admin .he route files exist by design.
 */
export function middleware(request) {
  const { pathname, search } = request.nextUrl;

  if (pathname.startsWith("/admin")) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api/")) {
    return NextResponse.next();
  }

  // Match paths ending in `.he` before extension or as final segment (dynamic routes).
  const heMatch = pathname.match(/^(.+)\.he(\/.*)?$/);
  if (heMatch) {
    const target = `${heMatch[1]}${heMatch[2] || ""}` || "/";
    const url = request.nextUrl.clone();
    url.pathname = target;
    return NextResponse.redirect(url, 308);
  }

  // Block Hebrew service worker if requested directly.
  if (pathname === "/sw.he.js") {
    return new NextResponse("Not Found", { status: 404 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff2?|ttf|eot|mp3|wav|webmanifest|json)$).*)",
  ],
};
