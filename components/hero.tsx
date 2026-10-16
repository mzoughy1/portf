"use client";

import { AvailableBadge } from "@/components/available-badge";
import { ButtonLink } from "@/components/button";
import { useIntent } from "@/components/providers";
import { Terminal } from "@/components/terminal";
import { profile } from "@/content/profile";
import { getCvUrl } from "@/lib/site";

const fallback = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#contact", label: "Contact" },
  { href: "#experience", label: "Hire" },
];

export function Hero() {
  const { emphasized, chooseIntent } = useIntent();
  const cvUrl = getCvUrl();
  const hiring = emphasized("cv");
  const contacting = emphasized("contact");

  return (
    <section id="top" className="scroll-mt-24 px-5 pt-12 pb-16 md:px-8 md:pt-20 md:pb-24">
      <div className="mx-auto grid w-full max-w-6xl items-end gap-12 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]">
        <div>
          <AvailableBadge />
          <p className="mt-6 font-mono text-xs tracking-[0.18em] text-accent-text uppercase">
            {profile.location}
          </p>
          <h1 className="mt-4 font-display text-[clamp(3.2rem,8vw,6.4rem)] leading-[0.9] tracking-tight text-ink">
            {profile.givenName}
            <span className="block text-accent-text">{profile.familyName}</span>
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-8 text-muted">
            {profile.title} with {profile.years} years of experience. Laravel, React, Next.js, Node.js,
            and Linux deployments.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="#contact" variant={contacting ? "ghost" : "solid"} emphasized={contacting}>
              Contact me
            </ButtonLink>
            {cvUrl ? (
              <ButtonLink href={cvUrl} variant={hiring ? "solid" : "ghost"} emphasized={hiring} external>
                Download CV
              </ButtonLink>
            ) : (
              <button
                type="button"
                className="inline-flex cursor-not-allowed items-center rounded-full border border-line px-5 py-3 text-sm font-semibold text-muted"
                disabled
                title="The CV PDF is not published yet."
              >
                Download CV
              </button>
            )}
          </div>
        </div>
        <div>
          <Terminal onHire={() => chooseIntent("hiring")} />
          <p className="mt-4 text-sm text-muted">Prefer to click?</p>
          <ul className="mt-3 flex flex-wrap gap-2">
            {fallback.map((link) => (
              <li key={link.href}>
                <a
                  href={link.href}
                  className="inline-flex rounded-full border border-line bg-surface px-3 py-1.5 text-sm text-ink hover:border-accent-text"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
