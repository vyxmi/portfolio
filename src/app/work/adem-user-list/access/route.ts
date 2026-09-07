import { NextRequest, NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_SECONDS, createAccessToken, passwordMatches } from "@/lib/case-study-access";

export async function POST(request: NextRequest) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return new NextResponse(null, { status: 403 });
  }
  const data = await request.formData();
  const lock = data.get("action") === "lock";
  const valid = !lock && passwordMatches(String(data.get("password") ?? ""));
  const destination = new URL(`/work/adem-user-list${!lock && !valid ? "?access=incorrect#reviewer-access" : ""}`, request.url);
  const response = NextResponse.redirect(destination, 303);
  response.headers.set("Cache-Control", "private, no-store");
  if (valid || lock) response.cookies.set(ACCESS_COOKIE, valid ? createAccessToken() : "", {
    httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: valid ? ACCESS_SECONDS : 0,
  });
  return response;
}
