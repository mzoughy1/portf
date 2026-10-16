import { profile } from "@/content/profile";

export function AvailableBadge() {
  if (!profile.availableForWork) return null;

  return (
    <p className="inline-flex items-center gap-2 rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink">
      <span className="pulse-dot size-2 rounded-full bg-accent" aria-hidden="true" />
      Available for work
    </p>
  );
}
