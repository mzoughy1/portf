"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Reveal } from "@/components/reveal";
import { Section } from "@/components/section";
import { experience } from "@/content/experience";

export function Experience() {
  const reduce = useReducedMotion();

  return (
    <Section id="experience" kicker="02 — Timeline" title="Experience" emphasis="experience">
      <ol className="relative space-y-10 border-l border-line pl-8">
        {experience.map((item, index) => (
          <motion.li
            key={item.company}
            initial={reduce ? undefined : { opacity: 0, y: 14 }}
            whileInView={reduce ? undefined : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -10% 0px" }}
            transition={{ duration: 0.45, delay: reduce ? 0 : index * 0.06 }}
            className="relative"
          >
            <span
              className="absolute top-2 -left-[39px] size-3 rounded-full border-2 border-bg bg-accent"
              aria-hidden="true"
            />
            <Reveal>
              <p className="font-mono text-sm text-accent-text">{item.period}</p>
              <h3 className="mt-2 font-display text-3xl text-ink">{item.company}</h3>
              {item.title ? <p className="mt-1 text-ink">{item.title}</p> : null}
              <ul className="mt-4 space-y-3 text-muted">
                {item.points.map((point) => (
                  <li key={point} className="leading-7">
                    {point}
                  </li>
                ))}
              </ul>
            </Reveal>
          </motion.li>
        ))}
      </ol>
    </Section>
  );
}
