import { jsonError, jsonOk } from "@/lib/http";
import { ipFromRequest, rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { normalizeStats } from "@/lib/stats";
import { getAdminClient } from "@/lib/supabase/admin";
import { supabaseSetupMessage } from "@/lib/supabase/errors";
import { fieldErrors, interestSchema } from "@/lib/validations";

export async function POST(request: Request) {
  const limit = RATE_LIMITS.interests;
  const gate = rateLimit(ipFromRequest(request), "interests", limit.limit, limit.windowMs);
  if (!gate.ok) {
    return jsonError(
      429,
      "Too many updates from this network. Please wait a few minutes and try again.",
      undefined,
      gate.retryAfter,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "The selection could not be read.");
  }

  const parsed = interestSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please choose again.", { fieldErrors: fieldErrors(parsed.error) });
  }

  if (parsed.data.hp_field.trim()) {
    return jsonOk({ stats: null });
  }

  const supabase = getAdminClient();
  if (!supabase) {
    return jsonError(503, "Live stats are not connected yet. Your choice still stays in this browser.");
  }

  const topics = [...new Set(parsed.data.topics)];
  const { error } = await supabase.from("visitor_interests").insert({
    intent: parsed.data.intent,
    topics,
  });

  if (error) {
    console.error("Visitor interest insert failed.", error.code);
    return jsonError(500, supabaseSetupMessage(error));
  }

  const { data, error: statsError } = await supabase.rpc("visitor_interest_stats");
  if (statsError) {
    return jsonOk({ stats: null });
  }

  return jsonOk({ stats: normalizeStats(data) });
}
