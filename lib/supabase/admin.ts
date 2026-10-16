import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let admin: SupabaseClient | null = null;

/** Server-only. Uses the service role key and must never be imported from client components. */
export function getAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() || process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();
  if (!url || !key) return null;

  if (!admin) {
    admin = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return admin;
}
