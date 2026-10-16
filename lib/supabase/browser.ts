import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let browser: SupabaseClient | null = null;

/**
 * Public client. The anon key is meant to be public.
 * Row Level Security is what limits it to inserts, approved guestbook rows, and aggregate stats.
 */
export function getBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return null;

  if (!browser) {
    browser = createClient(url, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }

  return browser;
}
