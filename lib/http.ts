export function jsonOk(body: Record<string, unknown>, status = 200) {
  return Response.json({ ok: true, ...body }, { status, headers: { "Cache-Control": "no-store" } });
}

export function jsonError(status: number, error: string, extra?: Record<string, unknown>, retryAfter?: number) {
  const headers = new Headers({ "Cache-Control": "no-store" });
  if (retryAfter) headers.set("Retry-After", String(retryAfter));
  return Response.json({ ok: false, error, ...extra }, { status, headers });
}
