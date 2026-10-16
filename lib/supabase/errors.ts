type SupabaseError = {
  code?: string;
  message?: string;
} | null;

export function supabaseSetupMessage(error: SupabaseError) {
  const code = error?.code ?? "";
  const message = (error?.message ?? "").toLowerCase();

  if (
    code === "PGRST202" ||
    code === "PGRST205" ||
    code === "42P01" ||
    code === "42883" ||
    message.includes("schema cache") ||
    message.includes("does not exist")
  ) {
    return "Supabase is connected, but the tables are not created yet. Open the Supabase SQL editor and run supabase/migrations/0001_init.sql.";
  }

  if (code === "PGRST301" || message.includes("invalid api key") || message.includes("jwt")) {
    return "Supabase rejected the key. Set SUPABASE_SERVICE_ROLE_KEY to the service_role secret, then redeploy.";
  }

  return "Supabase could not complete that request. Check the project URL and keys in Vercel, then redeploy.";
}
