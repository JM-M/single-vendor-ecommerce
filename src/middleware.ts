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
  const url = req.nextUrl;

  // Hostname -> mike.cumroad.com | mike.localhost:3000
  const hostname = req.headers.get("host") || "";

  const rootDomain = process.env.NEXT_PUBLIC_ROOT_DOMAIN || "";

  if (hostname.endsWith(`.${rootDomain}`)) {
    const tenantSlug = hostname.replace(`.${rootDomain}`, "");
    return NextResponse.rewrite(
      new URL(`/tenants/${tenantSlug}${url.pathname}`, req.url),
    );
  }

  return NextResponse.next();
}
