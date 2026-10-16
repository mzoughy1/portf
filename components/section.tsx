"use client";

import { useIntent } from "@/components/providers";
import { Reveal } from "@/components/reveal";
import type { EmphasisId } from "@/content/interests";
import { cn } from "@/lib/utils";

export function Section({
  id,
  kicker,
  title,
  emphasis,
  children,
}: {
  id: string;
  kicker: string;
  title: string;
  emphasis?: EmphasisId;
  children: React.ReactNode;
}) {
  const { emphasized } = useIntent();
  const active = emphasis ? emphasized(emphasis) : false;

  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cn("scroll-mt-24 py-20 md:py-28", active && "section-emphasis")}
    >
      <div className="mx-auto w-full max-w-6xl px-5 md:px-8">
        <Reveal>
          <div className="mb-10 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-mono text-xs tracking-[0.18em] text-accent-text uppercase">{kicker}</p>
              <h2
                id={`${id}-heading`}
                className="mt-3 font-display text-4xl tracking-tight text-ink md:text-5xl"
              >
                {title}
              </h2>
            </div>
            {active ? (
              <p className="rounded-full border border-accent/50 bg-accent/15 px-3 py-1 text-sm text-ink">
                Relevant to your visit
              </p>
            ) : null}
          </div>
        </Reveal>
        {children}
      </div>
    </section>
  );
}
