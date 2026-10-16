function stripProtocol(host: string) {
  return host.replace(/^https?:\/\//, "").replace(/\/$/, "");
}

export function getSiteUrl() {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const production = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (production) return `https://${stripProtocol(production)}`;

  const vercel = process.env.VERCEL_URL?.trim();
  if (vercel) return `https://${stripProtocol(vercel)}`;

  return "http://localhost:3000";
}

export function getCvUrl() {
  return process.env.NEXT_PUBLIC_CV_URL?.trim() || "";
}

export function getPhotoUrl() {
  return process.env.NEXT_PUBLIC_PHOTO_URL?.trim() || "";
}
