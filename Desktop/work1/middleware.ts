import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WAITLIST_PATH = "/waitlist";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isWaitlist = pathname === WAITLIST_PATH;
  const isApiRoute = pathname.startsWith("/api");
  const isNextAsset = pathname.startsWith("/_next");
  const isFavicon = pathname === "/favicon.ico";
  const isStaticFile = /\.[a-zA-Z0-9]+$/.test(pathname);

  if (isWaitlist || isApiRoute || isNextAsset || isFavicon || isStaticFile) {
    return NextResponse.next();
  }

  return NextResponse.redirect(new URL(WAITLIST_PATH, request.url));
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
