export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function percent(count: number, total: number) {
  if (total <= 0 || count <= 0) return 0;
  return Math.round((count / total) * 100);
}
