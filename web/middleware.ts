import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PASSWORD = process.env.SITE_PASSWORD || "";

export function middleware(req: NextRequest) {
  // No protection if env var is unset (safe-by-default in local dev)
  if (!PASSWORD) return NextResponse.next();

  const auth = req.headers.get("authorization");
  if (auth) {
    const [scheme, encoded] = auth.split(" ");
    if (scheme === "Basic" && encoded) {
      try {
        const decoded = atob(encoded);
        const idx = decoded.indexOf(":");
        const pass = idx >= 0 ? decoded.slice(idx + 1) : "";
        if (pass === PASSWORD) {
          return NextResponse.next();
        }
      } catch {
        // fall through to 401
      }
    }
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: {
      "WWW-Authenticate": 'Basic realm="Team Plugins", charset="UTF-8"',
    },
  });
}

export const config = {
  // Protect everything except Next internals & static assets
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
