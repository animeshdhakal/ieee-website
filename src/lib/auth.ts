import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Re-verifies Supabase authentication session for server actions and protected routes.
 * Redirects to the login page when there is no authenticated user.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
