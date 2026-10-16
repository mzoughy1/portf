type TurnstileResult =
  | { ok: true }
  | { ok: false; error: string };

export async function verifyTurnstile(token: string): Promise<TurnstileResult> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim();

  if (!secret) {
    if (process.env.NODE_ENV !== "production") return { ok: true };
    return { ok: false, error: "Spam protection is not configured yet." };
  }

  if (!token) {
    return { ok: false, error: "Please complete the spam check." };
  }

  const body = new URLSearchParams();
  body.set("secret", secret);
  body.set("response", token);

  let payload: { success?: boolean };
  try {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
    });
    payload = (await response.json()) as { success?: boolean };
  } catch {
    return { ok: false, error: "The spam check could not be reached. Please try again." };
  }

  if (!payload.success) {
    return { ok: false, error: "The spam check failed. Please try again." };
  }

  return { ok: true };
}
