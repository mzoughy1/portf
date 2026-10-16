"use client";

import { useState } from "react";
import { buttonClass } from "@/components/button";
import { Honeypot, PrivacyNote, TextArea, TextField } from "@/components/form-controls";
import { useIntent } from "@/components/providers";
import { Section } from "@/components/section";
import { TurnstileWidget, turnstileSiteKey } from "@/components/turnstile-widget";
import { INTENTS, TOPICS } from "@/content/interests";
import { profile } from "@/content/profile";
import { cn } from "@/lib/utils";

const options = [...INTENTS.map((item) => item.label), ...TOPICS];

export function Contact() {
  const { intent, topics } = useIntent();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [override, setOverride] = useState<string[] | null>(null);
  const [hp, setHp] = useState("");
  const [token, setToken] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState("");
  const [pending, setPending] = useState(false);
  const siteKey = turnstileSiteKey();

  const derived = [
    intent ? INTENTS.find((item) => item.id === intent)?.label : "",
    ...topics,
  ].filter((item): item is string => Boolean(item));
  const selected = override ?? derived;

  function toggle(option: string) {
    const current = override ?? derived;
    setOverride(current.includes(option) ? current.filter((item) => item !== option) : [...current, option]);
  }

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setStatus("");
    setErrors({});
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          message,
          interests: selected,
          turnstileToken: token,
          hp_field: hp,
        }),
      });
      const payload = (await response.json()) as {
        ok?: boolean;
        error?: string;
        fieldErrors?: Record<string, string>;
      };
      if (!response.ok || !payload.ok) {
        setErrors(payload.fieldErrors ?? {});
        setStatus(payload.error || "The message was not sent.");
        return;
      }
      setName("");
      setEmail("");
      setMessage("");
      setToken("");
      setStatus("Message received. I will reply by email.");
    } catch {
      setStatus("The message was not sent. Please use the email address above.");
    } finally {
      setPending(false);
    }
  }

  return (
    <Section id="contact" kicker="07 — Hello" title="Contact" emphasis="contact">
      <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
        <div className="space-y-4 text-ink">
          <p>
            <a className="underline decoration-accent underline-offset-4" href={`mailto:${profile.email}`}>
              {profile.email}
            </a>
          </p>
          <p>
            <a className="underline decoration-accent underline-offset-4" href={profile.phoneHref}>
              {profile.phone}
            </a>
          </p>
          <p>
            <a
              className="underline decoration-accent underline-offset-4"
              href={profile.linkedin}
              target="_blank"
              rel="noreferrer noopener"
            >
              LinkedIn
            </a>
          </p>
        </div>
        <form className="relative space-y-4 rounded-3xl border border-line bg-surface p-6" onSubmit={onSubmit}>
          <Honeypot id="contact-hp" value={hp} onChange={setHp} />
          <TextField
            id="contact-name"
            label="Name"
            name="name"
            autoComplete="name"
            maxLength={80}
            required
            value={name}
            error={errors.name}
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            id="contact-email"
            label="Email"
            name="email"
            type="email"
            autoComplete="email"
            maxLength={120}
            required
            value={email}
            error={errors.email}
            onChange={(event) => setEmail(event.target.value)}
          />
          <TextArea
            id="contact-message"
            label="Message"
            name="message"
            maxLength={4000}
            required
            value={message}
            error={errors.message}
            onChange={(event) => setMessage(event.target.value)}
          />
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-ink">Interests, optional</legend>
            <div className="flex flex-wrap gap-2">
              {options.map((option) => {
                const on = selected.includes(option);
                return (
                  <button
                    key={option}
                    type="button"
                    aria-pressed={on}
                    onClick={() => toggle(option)}
                    className={cn(
                      "rounded-full border px-3 py-1.5 text-sm",
                      on ? "border-accent bg-accent text-accent-ink" : "border-line bg-bg text-ink",
                    )}
                  >
                    {option}
                  </button>
                );
              })}
            </div>
          </fieldset>
          <TurnstileWidget onToken={setToken} />
          {!siteKey ? (
            <p className="text-sm text-muted">
              The spam check is off until the Turnstile keys are added. This is separate from Supabase, and the form
              still sends.
            </p>
          ) : null}
          <button type="submit" className={buttonClass("solid")} disabled={pending || (Boolean(siteKey) && !token)}>
            {pending ? "Sending…" : "Send message"}
          </button>
          {status ? (
            <p role="status" className="text-sm text-ink">
              {status}
            </p>
          ) : null}
          <PrivacyNote>
            Your name, email, message, and any interests you tick are stored so I can reply. I do not store
            your IP address. Email {profile.email} if you want the message deleted. Cloudflare Turnstile may
            run a spam check in your browser; I do not keep the result.
          </PrivacyNote>
        </form>
      </div>
    </Section>
  );
}
