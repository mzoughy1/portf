"use client";

import { useEffect, useState } from "react";
import { Honeypot, PrivacyNote, TextArea, TextField } from "@/components/form-controls";
import { Section } from "@/components/section";
import { TurnstileWidget, turnstileSiteKey } from "@/components/turnstile-widget";
import { buttonClass } from "@/components/button";
import { profile } from "@/content/profile";
import { getBrowserClient } from "@/lib/supabase/browser";

type Entry = {
  id: string;
  name: string;
  message: string;
  created_at: string;
};

function formatDate(iso: string) {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(date);
}

async function loadEntries(): Promise<{ configured: boolean; entries: Entry[]; error?: string }> {
  const browser = getBrowserClient();
  if (browser) {
    const { data, error } = await browser
      .from("guestbook_approved")
      .select("id, name, message, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error) return { configured: true, entries: (data ?? []) as Entry[] };
  }

  const response = await fetch("/api/guestbook");
  const payload = (await response.json()) as {
    ok?: boolean;
    configured?: boolean;
    entries?: Entry[];
    error?: string;
  };
  if (!response.ok || !payload.ok) {
    return { configured: true, entries: [], error: payload.error || "The guestbook could not be loaded." };
  }
  return { configured: Boolean(payload.configured), entries: payload.entries ?? [] };
}

export function Guestbook() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [configured, setConfigured] = useState(true);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [hp, setHp] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const siteKey = turnstileSiteKey();
  const needsToken = Boolean(siteKey);

  useEffect(() => {
    let cancelled = false;
    loadEntries()
      .then((result) => {
        if (cancelled) return;
        setConfigured(result.configured);
        setEntries(result.entries);
        setLoadError(result.error ?? "");
      })
      .catch(() => {
        if (!cancelled) setLoadError("The guestbook could not be loaded.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setErrors({});
    try {
      const response = await fetch("/api/guestbook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, message, turnstileToken: token, hp_field: hp }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok || !payload.ok) {
        setErrors(payload.fieldErrors ?? {});
        setStatus(payload.error || "The note was not saved.");
        return;
      }
      setName("");
      setMessage("");
      setToken("");
      setStatus("Thanks. I will publish this after a quick look.");
    } catch {
      setStatus("The note was not saved. Please try again.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section id="guestbook" kicker="06 — Notes" title="Guestbook" emphasis="guestbook">
      <div className="grid gap-8 lg:grid-cols-2">
        <form className="relative space-y-4 rounded-3xl border border-line bg-surface p-6" onSubmit={onSubmit}>
          <Honeypot id="guest-hp" value={hp} onChange={setHp} />
          <TextField
            id="guest-name"
            label="Name"
            name="name"
            autoComplete="name"
            maxLength={80}
            required
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextArea
            id="guest-message"
            label="Note"
            name="message"
            maxLength={500}
            required
            value={message}
            error={errors.message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <TurnstileWidget onToken={setToken} />
          {!siteKey ? (
            <p className="text-sm text-muted">
              The spam check is off until the Turnstile keys are added. This is separate from Supabase, and the form
              still sends.
            </p>
          ) : null}
          <button type="submit" className={buttonClass("solid")} disabled={pending || (needsToken && !token)}>
            {pending ? "Sending…" : "Leave a note"}
          </button>
          {status ? (
            <p role={errors.name || errors.message ? "alert" : "status"} className="text-sm text-ink">
              {status}
            </p>
          ) : null}
          <PrivacyNote>
            Your name and note are stored so I can review them. Notes stay hidden until I approve them in
            Supabase. I do not store your IP address. Email{" "}
            <a className="text-accent-text underline" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>{" "}
            if you want a note deleted. Cloudflare Turnstile may run a spam check in your browser; I do not
            keep the result.
          </PrivacyNote>
        </form>
        <div>
          {loading ? <p className="text-muted">Loading notes…</p> : null}
          {loadError ? (
            <p className="text-danger" role="alert">
              {loadError}
            </p>
          ) : null}
          {!loading && !configured ? (
            <p className="text-muted">
              The guestbook opens once Supabase is connected. You can still email {profile.email}.
            </p>
          ) : null}
          {!loading && configured && !loadError && entries.length === 0 ? (
            <p className="text-muted">No notes yet. Leave the first one.</p>
          ) : null}
          <ul className="space-y-4">
            {entries.map((entry) => (
              <li key={entry.id} className="rounded-3xl border border-line bg-surface p-5">
                <p className="text-ink">{entry.message}</p>
                <p className="mt-3 text-sm text-muted">
                  {entry.name}
                  {entry.created_at ? ` · ${formatDate(entry.created_at)}` : ""}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Section>
  );
}
