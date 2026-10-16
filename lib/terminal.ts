import { profile } from "@/content/profile";
import { projects } from "@/content/projects";
import { skillGroups } from "@/content/skills";

export type TerminalLine = {
  kind: "command" | "output" | "error";
  text: string;
};

const HELP = [
  "help       list commands",
  "about      short summary",
  "skills     tools I use",
  "projects   selected work",
  "contact    email and form",
  "hire       experience and CV",
  "clear      clear this screen",
];

export function runCommand(raw: string): { lines: TerminalLine[]; href?: string } {
  const command = raw.trim().toLowerCase();

  if (!command) return { lines: [] };

  if (command === "help") {
    return { lines: HELP.map((text) => ({ kind: "output", text })) };
  }

  if (command === "about") {
    return {
      href: "#about",
      lines: [
        ...profile.summary.map((text) => ({ kind: "output" as const, text })),
        {
          kind: "output",
          text: `${profile.education.credential}, ${profile.education.school} (${profile.education.year}).`,
        },
      ],
    };
  }

  if (command === "skills") {
    return {
      href: "#skills",
      lines: skillGroups.map((group) => ({
        kind: "output",
        text: `${group.label}: ${group.skills.join(", ")}`,
      })),
    };
  }

  if (command === "projects") {
    return {
      href: "#projects",
      lines: projects.map((project) => ({
        kind: "output",
        text: `${project.title} — ${project.result}`,
      })),
    };
  }

  if (command === "contact") {
    return {
      href: "#contact",
      lines: [
        { kind: "output", text: profile.email },
        { kind: "output", text: profile.phone },
        { kind: "output", text: "The contact form is further down the page." },
      ],
    };
  }

  if (command === "hire") {
    return {
      href: "#experience",
      lines: [
        {
          kind: "output",
          text: `${profile.years} years across Lebrackyard, Yanacom, Wellcom International, and Elan By Connect.`,
        },
        {
          kind: "output",
          text: "The CV download sits in the introduction. Experience is highlighted below.",
        },
      ],
    };
  }

  const shown = raw.trim().slice(0, 40);
  return {
    lines: [
      { kind: "error", text: `Command not found: ${shown}` },
      { kind: "output", text: "Type help to see the list." },
    ],
  };
}
