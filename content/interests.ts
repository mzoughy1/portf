export const INTENTS = [
  {
    id: "hiring",
    label: "Hiring",
    cameTo: "hire",
    description: "You are looking at me for a role.",
  },
  {
    id: "freelance",
    label: "Freelance project",
    cameTo: "talk about a freelance project",
    description: "You have a build, a rescue, or a fix in mind.",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    cameTo: "collaborate",
    description: "You want to work on something together.",
  },
  {
    id: "browsing",
    label: "Just browsing",
    cameTo: "browse",
    description: "You are looking around.",
  },
] as const;

export type IntentId = (typeof INTENTS)[number]["id"];

export const TOPICS = ["Laravel", "React", "Next.js", "DevOps", "SEO", "WordPress"] as const;

export type Topic = (typeof TOPICS)[number];

export const EMPHASIS_IDS = [
  "experience",
  "cv",
  "projects",
  "contact",
  "skills",
  "guestbook",
] as const;

export type EmphasisId = (typeof EMPHASIS_IDS)[number];

export const emphasisByIntent: Record<IntentId, readonly EmphasisId[]> = {
  hiring: ["experience", "cv"],
  freelance: ["projects", "contact"],
  collaboration: ["skills", "contact"],
  browsing: ["projects", "guestbook"],
};

export const intentNote: Record<IntentId, string> = {
  hiring: "Experience and the CV download are brought forward for this visit.",
  freelance: "Case studies and the contact form are brought forward for this visit.",
  collaboration: "Skills and the contact form are brought forward for this visit.",
  browsing: "Selected work and the guestbook are brought forward for this visit.",
};

export function isIntentId(value: unknown): value is IntentId {
  return INTENTS.some((item) => item.id === value);
}

export function isTopic(value: unknown): value is Topic {
  return (TOPICS as readonly string[]).includes(String(value));
}
