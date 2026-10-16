"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { useIntent } from "@/components/providers";
import { INTENTS, type IntentId } from "@/content/interests";
import { profile } from "@/content/profile";

const WELCOME_KEY = "mam-welcome";
const WELCOME_EVENT = "mam-welcome-change";

function hasSeenWelcome() {
  try {
    return localStorage.getItem(WELCOME_KEY) === "1";
  } catch {
    return true;
  }
}

function rememberWelcome() {
  try {
    localStorage.setItem(WELCOME_KEY, "1");
  } catch {
    // The popup can still close for this page view.
  }
  window.dispatchEvent(new Event(WELCOME_EVENT));
}

export function Welcome() {
  const { chooseIntent } = useIntent();
  const dialogRef = useRef<HTMLDivElement>(null);
  const seen = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(WELCOME_EVENT, onStoreChange);
      return () => window.removeEventListener(WELCOME_EVENT, onStoreChange);
    },
    hasSeenWelcome,
    () => true,
  );
  const open = !seen;

  useEffect(() => {
    if (!open) return;
    const dialog = dialogRef.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialog?.querySelector<HTMLElement>("button")?.focus();

    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") {
        rememberWelcome();
        return;
      }
      if (event.key !== "Tab" || !dialog) return;
      const items = [...dialog.querySelectorAll<HTMLElement>("button")];
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!open) return null;

  function pick(intent: IntentId) {
    chooseIntent(intent);
    rememberWelcome();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center p-4 sm:items-center">
      <button
        type="button"
        className="absolute inset-0 bg-[#10140f]/70"
        aria-label="Dismiss welcome"
        onClick={rememberWelcome}
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="welcome-title"
        className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow)]"
      >
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff8b7a]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-[#e7c15a]" aria-hidden="true" />
          <span className="size-2.5 rounded-full bg-accent" aria-hidden="true" />
          <span className="ml-2 font-mono text-xs text-muted">first-visit</span>
        </div>
        <div className="px-5 py-5 sm:px-6">
          <p className="font-mono text-sm text-accent-text">visitor@mzoughi:~$ hello</p>
          <h2 id="welcome-title" className="mt-3 font-display text-3xl tracking-tight text-ink">
            First time on this page.
          </h2>
          <p className="mt-2 text-sm leading-6 text-muted">
            Tell me what to open first. I will tune the page for this browser. The anonymous tally still waits
            until you choose to count the visit.
          </p>
          <div className="mt-5 grid gap-2 sm:grid-cols-2">
            {INTENTS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => pick(item.id)}
                className="rounded-2xl border border-line bg-bg px-4 py-3 text-left text-sm text-ink hover:border-accent-text"
              >
                <span className="block font-medium">{item.label}</span>
                <span className="mt-1 block text-muted">{item.description}</span>
              </button>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-between gap-3">
            <p className="text-xs text-muted">{profile.name} · Tunis</p>
            <button type="button" className="text-sm text-ink underline decoration-line underline-offset-4" onClick={rememberWelcome}>
              Show me the page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
