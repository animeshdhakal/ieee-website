import { type NextRequest } from "next/server";
import { updateSession } from "@/utils/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Only guard admin routes. The login page is handled inside updateSession.
  matcher: ["/admin/:path*"],
};
