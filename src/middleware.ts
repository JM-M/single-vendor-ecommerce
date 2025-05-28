import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: [
    /*
    Match all paths except for:
    1. /api routes.
    2. /_next
    3. /_static
    4. all root inside /public (e.g. /favicon.ico)
    */
    "/((?!api/|_next/|_static/|_vercel|media/|[\w-]+\.\w+).*)",
  ],
};

export default async function middleware(req: NextRequest) {
  return NextResponse.next();
}
