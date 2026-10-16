import { profile } from "@/content/profile";
import { jsonError, jsonOk } from "@/lib/http";
import { ipFromRequest, rateLimit, RATE_LIMITS } from "@/lib/rate-limit";
import { getAdminClient } from "@/lib/supabase/admin";
import { supabaseSetupMessage } from "@/lib/supabase/errors";
import { sendContactEmail } from "@/lib/email";
import { verifyTurnstile } from "@/lib/turnstile";
import { contactSchema, fieldErrors } from "@/lib/validations";

export async function POST(request: Request) {
  const limit = RATE_LIMITS.contact;
  const gate = rateLimit(ipFromRequest(request), "contact", limit.limit, limit.windowMs);
  if (!gate.ok) {
    return jsonError(
      429,
      "Too many messages from this network. Please wait a few minutes and try again.",
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

  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return jsonError(400, "Please check the form.", { fieldErrors: fieldErrors(parsed.error) });
  }

  if (parsed.data.hp_field.trim()) {
    return jsonOk({ emailed: false });
  }

  const turnstile = await verifyTurnstile(parsed.data.turnstileToken);
  if (!turnstile.ok) return jsonError(400, turnstile.error);

  const supabase = getAdminClient();
  if (!supabase) {
    return jsonError(
      503,
      `The form is not connected yet. Email ${profile.email} and it will reach me directly.`,
    );
  }

  const interests = [...new Set(parsed.data.interests.map((item) => item.trim()).filter(Boolean))];
  const { error } = await supabase.from("contacts").insert({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    message: parsed.data.message,
    interests,
  });

  if (error) {
    console.error("Contact insert failed.", error.code);
    return jsonError(500, supabaseSetupMessage(error));
  }

  const emailed = await sendContactEmail({
    name: parsed.data.name,
    email: parsed.data.email.toLowerCase(),
    message: parsed.data.message,
    interests,
  });

  return jsonOk({ emailed });
}
