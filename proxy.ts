import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  if (request.nextUrl.pathname !== "/mn" && request.nextUrl.pathname.toLowerCase() === "/mn") {
    const url = request.nextUrl.clone();
    url.pathname = "/mn";
    return NextResponse.redirect(url, 308);
  }
  return NextResponse.next();
}
export const config = { matcher: ["/:path(mn|MN|Mn|mN)"] };
