"use client";

import { useTheme } from "@/components/providers";

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const light = theme === "light";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-pressed={light}
      className="inline-flex size-10 items-center justify-center rounded-full border border-line bg-surface text-ink"
    >
      <span className="sr-only">{light ? "Switch to dark mode" : "Switch to light mode"}</span>
      {light ? <MoonIcon /> : <SunIcon />}
    </button>
  );
}

function SunIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M4.9 4.9l1.8 1.8M17.3 17.3l1.8 1.8M19.1 4.9l-1.8 1.8M6.7 17.3l-1.8 1.8" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M21 14.5A8.5 8.5 0 1 1 9.5 3 7 7 0 0 0 21 14.5z" />
    </svg>
  );
}
