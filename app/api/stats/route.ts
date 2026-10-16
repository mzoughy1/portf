import { connection } from "next/server";
import { jsonError, jsonOk } from "@/lib/http";
import { normalizeStats } from "@/lib/stats";
import { getAdminClient } from "@/lib/supabase/admin";
import { supabaseSetupMessage } from "@/lib/supabase/errors";

export async function GET() {
  await connection();
  const supabase = getAdminClient();
  if (!supabase) return jsonOk({ configured: false, stats: normalizeStats(null) });

  const { data, error } = await supabase.rpc("visitor_interest_stats");
  if (error) {
    console.error("Visitor stats read failed.", error.code);
    return jsonError(500, supabaseSetupMessage(error));
  }

  return jsonOk({ configured: true, stats: normalizeStats(data) });
}
