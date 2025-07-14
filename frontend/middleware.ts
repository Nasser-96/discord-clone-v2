import createMiddleware from "next-intl/middleware";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import intlConfig from "./next-intl.config";

const intlMiddleware = createMiddleware(intlConfig);

export function middleware(request: NextRequest) {
  // Apply next-intl middleware logic first
  const response = intlMiddleware(request);

  // Add your custom header
  response.headers.set("x-current-path", request.nextUrl.pathname);

  return response;
}

export const config = {
  matcher: ["/", "/(en|ar)/:path*"], // Locale-specific matcher
};
