"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { profile } from "@/content/profile";
import { getPhotoUrl } from "@/lib/site";

export function About() {
  const photoUrl = getPhotoUrl();
  const [failed, setFailed] = useState(false);
  const showPhoto = Boolean(photoUrl) && !failed;

  return (
    <Section id="about" kicker="01 — Profile" title="About">
      <div className="grid items-start gap-10 md:grid-cols-[minmax(0,1fr)_240px]">
        <Reveal>
          <div className="max-w-2xl space-y-5 text-lg leading-8 text-muted">
            {profile.summary.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <dl className="mt-8 grid gap-4 sm:grid-cols-3">
            <Stat label="Experience" value={`${profile.years} years`} />
            <Stat label="Production work" value="50+ projects" />
            <Stat label="Clients" value="Europe and MENA" />
          </dl>
          <p className="mt-8 text-ink">
            {profile.education.credential}, {profile.education.school} ({profile.education.year}).
          </p>
        </Reveal>
        <Reveal delay={0.08}>
          <figure className="mx-auto w-full max-w-[240px]">
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border border-line bg-surface">
              {showPhoto ? (
                <Image
                  src={photoUrl}
                  alt={profile.name}
                  fill
                  sizes="240px"
                  className="object-cover"
                  onError={() => setFailed(true)}
                />
              ) : (
                <div className="flex h-full flex-col items-center justify-center bg-[radial-gradient(circle_at_30%_20%,color-mix(in_srgb,var(--accent)_55%,transparent),transparent_58%)]">
                  <span className="font-display text-6xl text-ink">MA</span>
                  <span className="mt-2 font-mono text-xs tracking-[0.16em] text-muted uppercase">Photo</span>
                </div>
              )}
            </div>
            <figcaption className="sr-only">Portrait of {profile.name}</figcaption>
          </figure>
        </Reveal>
      </div>
    </Section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-line bg-surface px-4 py-4">
      <dt className="text-sm text-muted">{label}</dt>
      <dd className="mt-1 font-display text-2xl text-ink">{value}</dd>
    </div>
  );
}
