type Bucket = { timestamps: number[] };

const buckets = new Map<string, Bucket>();

export const RATE_LIMITS = {
  contact: { limit: 5, windowMs: 10 * 60 * 1000 },
  guestbook: { limit: 5, windowMs: 10 * 60 * 1000 },
  interests: { limit: 8, windowMs: 10 * 60 * 1000 },
} as const;

/**
 * The IP is held only in this process memory so a burst of requests can be slowed.
 * It is never written to the database, logs, or the response.
 */
export function rateLimit(ip: string, bucketName: string, limit: number, windowMs: number) {
  const now = Date.now();
  const key = `${bucketName}:${ip}`;
  const existing = buckets.get(key);
  const fresh = (existing?.timestamps ?? []).filter((stamp) => now - stamp < windowMs);

  if (fresh.length >= limit) {
    const retryAfter = Math.max(1, Math.ceil((fresh[0] + windowMs - now) / 1000));
    buckets.set(key, { timestamps: fresh });
    return { ok: false as const, retryAfter };
  }

  fresh.push(now);
  buckets.set(key, { timestamps: fresh });

  if (buckets.size > 5000) {
    for (const [storedKey, bucket] of buckets) {
      if (bucket.timestamps.every((stamp) => now - stamp >= windowMs)) {
        buckets.delete(storedKey);
      }
    }
  }

  return { ok: true as const };
}

export function ipFromRequest(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for");
  const first = forwarded?.split(",")[0]?.trim();
  return first || request.headers.get("x-real-ip")?.trim() || "unknown";
}
