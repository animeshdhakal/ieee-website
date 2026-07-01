import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";

/**
 * Server actions are directly reachable over the network, so every mutation
 * must re-verify the session rather than trust the middleware. Redirects to the
 * login page when there is no authenticated user.
 */
export async function requireUser() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}
