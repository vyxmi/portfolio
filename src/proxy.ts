import { NextRequest, NextResponse } from "next/server";

// Protected images must never enter the shared, unauthenticated image cache.
export function proxy(request: NextRequest) {
  const source = request.nextUrl.searchParams.get("url") ?? "";
  let pathname: string;
  try { pathname = decodeURIComponent(new URL(source, request.url).pathname); }
  catch { return new NextResponse(null, { status: 400 }); }
  if (pathname.startsWith("/protected-media/") || pathname.startsWith("/case-studies/adem-user-list/") || pathname.startsWith("/brain/media/")) {
    return new NextResponse(null, { status: 404, headers: { "Cache-Control": "no-store" } });
  }
  return NextResponse.next();
}
export const config = { matcher: "/_next/image" };
