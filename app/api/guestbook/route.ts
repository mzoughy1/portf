import { connection } from "next/server";
import { profile } from "@/content/profile";
import { jsonError, jsonOk } from "@/lib/http";
import { ipFromRequest, rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";
import { verifyTurnstile } from "@/lib/turnstile";
import { fieldErrors, guestbookSchema } from "@/lib/validations";

export async function GET() {
  await connection();
  const supabase = getAdminClient();
  if (!supabase) return jsonOk({ configured: false, entries: [] });

  const { data, error } = await supabase
    .from("guestbook")
    .select("id, name, message, created_at")
    .eq("approved", true)
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Guestbook read failed.");
    return jsonError(500, "The guestbook could not be loaded.");
  }

  return jsonOk({ configured: true, entries: data ?? [] });
}

export async function POST(request: Request) {
  const limit = RATE_LIMITS.guestbook;
  const gate = rateLimit(ipFromRequest(request), "guestbook", limit.limit, limit.windowMs);
  if (!gate.ok) {
    return jsonError(
      429,
      "Too many notes from this network. Please wait a few minutes and try again.",
      undefined,
      gate.retryAfter,
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return jsonError(400, "The form could not be read.");
  }

  const parsed = guestbookSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please check the note.", { fieldErrors: fieldErrors(parsed.error) });
  }

  if (parsed.data.hp_field.trim()) {
    return jsonOk({});
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.ok) return jsonError(400, turnstile.error);

  const supabase = getAdminClient();
  if (!supabase) {
    return jsonError(503, `The guestbook is not connected yet. Email ${profile.email} instead.`);
  }

  const { error } = await supabase.from("guestbook").insert({
    name: parsed.data.name,
    message: parsed.data.message,
    approved: false,
  });

  if (error) {
    console.error("Guestbook insert failed.");
    return jsonError(500, "The note was not saved. Please try again.");
  }

  return jsonOk({});
}
