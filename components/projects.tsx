"use client";

import Image from "next/image";
import { useState } from "react";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { useIntent } from "@/components/providers";
import { projects } from "@/content/projects";

export function Projects() {
  const { topics } = useIntent();

  return (
    <Section id="projects" kicker="03 — Selected work" title="Projects" emphasis="projects">
      <div className="grid gap-5 md:grid-cols-2">
        {projects.map((project, index) => {
          const matches = project.stack.filter((item) =>
            topics.some((topic) => item.toLowerCase().includes(topic.toLowerCase())),
          );
          return (
            <Reveal key={project.slug} delay={index * 0.04}>
              <article className="flex h-full flex-col overflow-hidden rounded-3xl border border-line bg-surface transition hover:-translate-y-1 hover:border-accent-text">
                <ProjectVisual title={project.title} image={project.image} context={project.context} index={index} />
                <div className="flex flex-1 flex-col p-6">
                  <p className="font-mono text-xs tracking-[0.14em] text-muted uppercase">
                    {project.context} · {project.period}
                  </p>
                  <h3 className="mt-3 font-display text-3xl text-ink">{project.title}</h3>
                  {matches.length > 0 ? (
                    <p className="mt-3 text-sm text-accent-text">Matches your topics: {matches.join(", ")}</p>
                  ) : null}
                  <dl className="mt-5 space-y-4 text-sm leading-6">
                    <Fact label="Problem" value={project.problem} />
                    <Fact label="Role" value={project.role} />
                    <Fact label="Result" value={project.result} />
                  </dl>
                  <ul className="mt-5 flex flex-wrap gap-2">
                    {project.stack.length > 0 ? (
                      project.stack.map((item) => (
                        <li key={item} className="rounded-full bg-surface-2 px-3 py-1 text-xs text-ink">
                          {item}
                        </li>
                      ))
                    ) : (
                      <li className="rounded-full bg-surface-2 px-3 py-1 text-xs text-muted">
                        Undocumented at handover
                      </li>
                    )}
                  </ul>
                </div>
              </article>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="font-medium text-ink">{label}</dt>
      <dd className="text-muted">{value}</dd>
    </div>
  );
}

function ProjectVisual({
  title,
  image,
  context,
  index,
}: {
  title: string;
  image?: string;
  context: string;
  index: number;
}) {
  const [failed, setFailed] = useState(false);
  if (image && !failed) {
    return (
      <div className="relative aspect-[16/9] bg-surface-2">
        <Image
          src={image}
          alt={title}
          fill
          sizes="(min-width: 768px) 50vw, 100vw"
          className="object-cover"
          onError={() => setFailed(true)}
        />
      </div>
    );
  }

  return (
    <div
      className="flex aspect-[16/9] items-end p-5"
      style={{
        backgroundImage: `linear-gradient(135deg, color-mix(in srgb, var(--accent) ${14 + index * 4}%, var(--surface-2)), var(--surface))`,
      }}
      aria-hidden="true"
    >
      <span className="font-mono text-xs tracking-[0.16em] text-ink uppercase">{context}</span>
    </div>
  );
}
