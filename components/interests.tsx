"use client";

import { useCallback, useEffect, useMemo, useState, useSyncExternalStore } from "react";
import { PrivacyNote } from "@/components/form-controls";
import { useIntent } from "@/components/providers";
import { Section } from "@/components/section";
import { INTENTS, TOPICS, intentNote, type IntentId, type Topic } from "@/content/interests";
import { getBrowserClient } from "@/lib/supabase/browser";
import { normalizeStats, type VisitorStats } from "@/lib/stats";
import { cn, percent } from "@/lib/utils";
import { buttonClass } from "@/components/button";

const POSTED_KEY = "mam-posted";
const POSTED_EVENT = "mam-posted-change";

function selectionKey(intent: IntentId, topics: Topic[]) {
  return JSON.stringify({ intent, topics: [...topics].sort() });
}

async function loadStats(): Promise<{ configured: boolean; stats: VisitorStats } | null> {
  const browser = getBrowserClient();
  if (browser) {
    const { data, error } = await browser.rpc("visitor_interest_stats");
    if (!error) return { configured: true, stats: normalizeStats(data) };
  }

  const response = await fetch("/api/stats");
  const payload = (await response.json()) as {
    ok?: boolean;
    configured?: boolean;
    stats?: unknown;
  };
  if (!response.ok || !payload.ok) return null;
  return {
    configured: Boolean(payload.configured),
    stats: normalizeStats(payload.stats),
  };
}

export function Interests() {
  const { intent, topics, chooseIntent, toggleTopic } = useIntent();
  const posted = useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener(POSTED_EVENT, onStoreChange);
      return () => window.removeEventListener(POSTED_EVENT, onStoreChange);
    },
    () => {
      try {
        return localStorage.getItem(POSTED_KEY) ?? "";
      } catch {
        return "";
      }
    },
    () => "",
  );
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [configured, setConfigured] = useState(true);

  const refresh = useCallback(async () => {
    const next = await loadStats();
    if (!next) return;
    setConfigured(next.configured);
    setStats(next.stats);
  }, []);

  useEffect(() => {
    const section = document.getElementById("interests");
    if (!section) return;
    let timer = 0;

    const observer = new IntersectionObserver(([entry]) => {
      window.clearInterval(timer);
      if (!entry?.isIntersecting) return;
      void refresh();
      timer = window.setInterval(() => {
        if (document.visibilityState === "visible") void refresh();
      }, 30000);
    });

    observer.observe(section);
    return () => {
      observer.disconnect();
      window.clearInterval(timer);
    };
  }, [refresh]);

  const currentKey = intent ? selectionKey(intent, topics) : "";
  const alreadyCounted = Boolean(currentKey) && posted === currentKey;

  const rows = useMemo(() => {
    const counts = new Map((stats?.intents ?? []).map((item) => [item.intent, item.count]));
    return INTENTS.map((item) => {
      const count = counts.get(item.id) ?? 0;
      return { ...item, count, percent: percent(count, stats?.total ?? 0) };
    });
  }, [stats]);

  const leader = rows.reduce<(typeof rows)[number] | null>((best, item) => {
    if (item.count <= 0) return best;
    if (!best || item.count > best.count) return item;
    return best;
  }, null);

  async function countVisit() {
    if (!intent || alreadyCounted) return;
    setPending(true);
    setMessage("");
    try {
      const response = await fetch("/api/interests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ intent, topics, hp_field: "" }),
      });
      const payload = (await response.json()) as { ok?: boolean; error?: string; stats?: unknown };
      if (!response.ok || !payload.ok) {
        setMessage(payload.error || "The tally was not saved.");
        return;
      }
      localStorage.setItem(POSTED_KEY, currentKey);
      window.dispatchEvent(new Event(POSTED_EVENT));
      setMessage("Counted. The page is tuned to this visit.");
      if (payload.stats) {
        setStats(normalizeStats(payload.stats));
        setConfigured(true);
      } else {
        await refresh();
      }
    } catch {
      setMessage("The tally was not saved. Your choice still stays in this browser.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section id="interests" kicker="05 — This visit" title="What brings you here?">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
        <div>
          <div className="grid gap-3 sm:grid-cols-2" role="group" aria-label="Intent">
            {INTENTS.map((item) => {
              const selected = intent === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => chooseIntent(item.id)}
                  className={cn(
                    "rounded-2xl border px-4 py-4 text-left transition hover:-translate-y-0.5",
                    selected ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink",
                  )}
                >
                  <span className="block font-medium">{item.label}</span>
                  <span className={cn("mt-1 block text-sm", selected ? "text-accent-ink/80" : "text-muted")}>
                    {item.description}
                  </span>
                </button>
              );
            })}
          </div>
          <p className="mt-6 text-sm font-medium text-ink">Topics</p>
          <div className="mt-3 flex flex-wrap gap-2" role="group" aria-label="Topics">
            {TOPICS.map((topic) => {
              const selected = topics.includes(topic);
              return (
                <button
                  key={topic}
                  type="button"
                  aria-pressed={selected}
                  onClick={() => toggleTopic(topic)}
                  className={cn(
                    "rounded-full border px-3 py-1.5 text-sm",
                    selected ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink",
                  )}
                >
                  {topic}
                </button>
              );
            })}
          </div>
          {intent ? <p className="mt-5 text-sm leading-6 text-muted">{intentNote[intent]}</p> : null}
          <button
            type="button"
            className={cn(buttonClass("solid"), "mt-5")}
            onClick={() => void countVisit()}
            disabled={!intent || pending || alreadyCounted}
          >
            {pending ? "Counting…" : alreadyCounted ? "Counted" : "Count my visit"}
          </button>
          <div className="mt-4">
            <PrivacyNote>
              Your choice stays in this browser so the page can adapt. The live tally stores only the
              intent and topic labels, with no name and no IP address, and only after you press the button.
            </PrivacyNote>
          </div>
          {message ? (
            <p className="mt-3 text-sm text-ink" role="status">
              {message}
            </p>
          ) : null}
        </div>
        <StatsPanel configured={configured} total={stats?.total ?? 0} leader={leader} rows={rows} topics={stats?.topics ?? []} />
      </div>
    </Section>
  );
}

function StatsPanel({
  configured,
  total,
  leader,
  rows,
  topics,
}: {
  configured: boolean;
  total: number;
  leader: { percent: number; cameTo: string } | null;
  rows: { id: string; label: string; percent: number; count: number }[];
  topics: { topic: string; count: number }[];
}) {
  return (
    <aside className="rounded-3xl border border-line bg-surface p-6" aria-live="polite">
      <p className="font-mono text-xs tracking-[0.16em] text-muted uppercase">Live stats</p>
      {!configured ? (
        <p className="mt-4 text-muted">
          Live stats connect once Supabase is set up. A choice you make here still stays in this browser.
        </p>
      ) : leader ? (
        <p className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink">
          {leader.percent}% of visitors came to {leader.cameTo}.
        </p>
      ) : (
        <p className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink">
          No tally yet. Your visit can be the first.
        </p>
      )}
      <p className="mt-3 text-sm text-muted">{total === 0 ? "Anonymous answers" : `${total} anonymous answers`}</p>
      <ul className="mt-6 space-y-3">
        {rows.map((row) => (
          <li key={row.id}>
            <div className="mb-1 flex justify-between text-sm">
              <span>{row.label}</span>
              <span className="text-muted">{row.percent}%</span>
            </div>
            <div className="h-2 overflow-hidden rounded-full bg-surface-2">
              <div className="h-full rounded-full bg-accent" style={{ width: `${row.percent}%` }} />
            </div>
          </li>
        ))}
      </ul>
      {topics.length > 0 ? (
        <ul className="mt-6 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <li key={topic.topic} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-ink">
              {topic.topic} · {topic.count}
            </li>
          ))}
        </ul>
      ) : null}
    </aside>
  );
}
