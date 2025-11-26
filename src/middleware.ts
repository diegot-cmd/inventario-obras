import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  // Simplemente deja pasar todas las peticiones
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/usuarios/:path*", "/reportes/:path*", "/usuarios", "/reportes"],
};
