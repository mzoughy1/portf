"use client";

import { useLayoutEffect, useMemo, useSyncExternalStore } from "react";
import { MotionConfig } from "framer-motion";
import {
  emphasisByIntent,
  isIntentId,
  isTopic,
  type EmphasisId,
  type IntentId,
  type Topic,
} from "@/content/interests";

const SELECTION_KEY = "mam-visit";
const THEME_EVENT = "mam-theme";
const VISIT_EVENT = "mam-visit-change";

type Theme = "dark" | "light";
type Visit = { intent: IntentId | null; topics: Topic[] };

function subscribe(eventName: string, onStoreChange: () => void) {
  window.addEventListener(eventName, onStoreChange);
  return () => window.removeEventListener(eventName, onStoreChange);
}

function themeFromStorage(): Theme {
  try {
    return localStorage.getItem("theme") === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}

function applyTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute("content", theme === "light" ? "#f6f3ec" : "#10140f");
}

function parseVisit(raw: string): Visit {
  if (!raw) return { intent: null, topics: [] };
  try {
    const parsed = JSON.parse(raw) as { intent?: unknown; topics?: unknown };
    return {
      intent: isIntentId(parsed.intent) ? parsed.intent : null,
      topics: Array.isArray(parsed.topics) ? parsed.topics.filter(isTopic) : [],
    };
  } catch {
    return { intent: null, topics: [] };
  }
}

function writeVisit(visit: Visit) {
  localStorage.setItem(SELECTION_KEY, JSON.stringify(visit));
  window.dispatchEvent(new Event(VISIT_EVENT));
}

export function useTheme() {
  const theme = useSyncExternalStore(
    (onStoreChange) => subscribe(THEME_EVENT, onStoreChange),
    themeFromStorage,
    () => "dark" as const,
  );

  useLayoutEffect(() => {
    applyTheme(theme);
  }, [theme]);

  return useMemo(
    () => ({
      theme,
      toggleTheme: () => {
        const next: Theme = themeFromStorage() === "dark" ? "light" : "dark";
        localStorage.setItem("theme", next);
        applyTheme(next);
        window.dispatchEvent(new Event(THEME_EVENT));
      },
    }),
    [theme],
  );
}

export function useIntent() {
  const raw = useSyncExternalStore(
    (onStoreChange) => subscribe(VISIT_EVENT, onStoreChange),
    () => {
      try {
        return localStorage.getItem(SELECTION_KEY) ?? "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  const visit = useMemo(() => parseVisit(raw), [raw]);

  return useMemo(
    () => ({
      intent: visit.intent,
      topics: visit.topics,
      chooseIntent: (intent: IntentId) => writeVisit({ intent, topics: visit.topics }),
      toggleTopic: (topic: Topic) => {
        const topics = visit.topics.includes(topic)
          ? visit.topics.filter((item) => item !== topic)
          : [...visit.topics, topic];
        writeVisit({ intent: visit.intent, topics });
      },
      emphasized: (id: EmphasisId) => Boolean(visit.intent && emphasisByIntent[visit.intent].includes(id)),
    }),
    [visit],
  );
}

function ThemeSync() {
  useTheme();
  return null;
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <ThemeSync />
      {children}
    </MotionConfig>
  );
}
