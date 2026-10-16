"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { useIntent } from "@/components/providers";
import { Section } from "@/components/section";
import { skillGroups, skillMatchesTopic } from "@/content/skills";
import { cn } from "@/lib/utils";

export function Skills() {
  const [filter, setFilter] = useState("all");
  const { topics } = useIntent();
  const reduce = useReducedMotion();
  const visible = filter === "all" ? skillGroups : skillGroups.filter((group) => group.id === filter);

  return (
    <Section id="skills" kicker="04 — Toolkit" title="Skills" emphasis="skills">
      <div className="flex flex-wrap gap-2" role="toolbar" aria-label="Filter skills">
        <FilterChip active={filter === "all"} onClick={() => setFilter("all")}>
          All
        </FilterChip>
        {skillGroups.map((group) => (
          <FilterChip key={group.id} active={filter === group.id} onClick={() => setFilter(group.id)}>
            {group.label}
          </FilterChip>
        ))}
      </div>
      <div className="mt-8 grid gap-4">
        {visible.map((group) => {
          const related = group.relatedTopics.some((topic) => topics.includes(topic as (typeof topics)[number]));
          return (
            <motion.section
              key={group.id}
              aria-label={group.label}
              layout={!reduce}
              className={cn(
                "rounded-3xl border border-line bg-surface p-5 md:p-6",
                related && "border-accent-text",
              )}
            >
              <h3 className="font-display text-2xl text-ink">{group.label}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {group.skills.map((skill) => {
                  const match = skillMatchesTopic(skill, topics);
                  return (
                    <motion.li
                      key={skill}
                      layout={!reduce}
                      whileHover={reduce ? undefined : { y: -2 }}
                      className={cn(
                        "rounded-full border border-line bg-surface-2 px-3 py-1.5 text-sm text-ink",
                        match && "border-accent bg-accent text-accent-ink",
                      )}
                    >
                      {skill}
                    </motion.li>
                  );
                })}
              </ul>
            </motion.section>
          );
        })}
      </div>
    </Section>
  );
}

function FilterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm",
        active ? "border-accent bg-accent text-accent-ink" : "border-line bg-surface text-ink hover:border-accent-text",
      )}
    >
      {children}
    </button>
  );
}
