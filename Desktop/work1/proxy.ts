import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const WAITLIST_PATH = "/waitlist";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isWaitlist = pathname === WAITLIST_PATH || pathname.startsWith(`${WAITLIST_PATH}/`);
  const isApiRoute = pathname.startsWith("/api");
  const isNextAsset = pathname.startsWith("/_next");
  const isFavicon = pathname === "/favicon.ico";
  const isStaticFile = pathname.split("/").pop()?.includes(".") ?? false;

  if (isWaitlist || isApiRoute || isNextAsset || isFavicon || isStaticFile) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = WAITLIST_PATH;
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/:path*"],
};
