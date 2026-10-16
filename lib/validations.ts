import { z } from "zod";
import { INTENTS, TOPICS } from "@/content/interests";

const intentIds = INTENTS.map((item) => item.id) as [
  (typeof INTENTS)[number]["id"],
  ...(typeof INTENTS)[number]["id"][],
];

const topicIds = [...TOPICS] as [TopicName, ...TopicName[]];

type TopicName = (typeof TOPICS)[number];

export const contactSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please add your name.")
    .max(80, "Name must be 80 characters or fewer."),
  email: z
    .string()
    .trim()
    .min(3, "Please add a valid email.")
    .max(120, "Email must be 120 characters or fewer.")
    .email("Please add a valid email."),
  message: z
    .string()
    .trim()
    .min(10, "Please write at least a short message.")
    .max(4000, "Message must be 4000 characters or fewer."),
  interests: z
    .array(
      z
        .string()
        .trim()
        .min(1)
        .max(40),
    )
    .max(12)
    .optional()
    .default([]),
  turnstileToken: z.string().max(2048).optional().default(""),
  hp_field: z.string().max(200).optional().default(""),
});

export const guestbookSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Please add a name.")
    .max(80, "Name must be 80 characters or fewer."),
  message: z
    .string()
    .trim()
    .min(2, "Please write a short note.")
    .max(500, "Notes are limited to 500 characters."),
  turnstileToken: z.string().max(2048).optional().default(""),
  hp_field: z.string().max(200).optional().default(""),
});

export const interestSchema = z.object({
  intent: z.enum(intentIds),
  topics: z.array(z.enum(topicIds)).max(TOPICS.length).default([]),
  hp_field: z.string().max(200).optional().default(""),
});

export type ContactInput = z.infer<typeof contactSchema>;
export type GuestbookInput = z.infer<typeof guestbookSchema>;
export type InterestInput = z.infer<typeof interestSchema>;

export function fieldErrors(error: z.ZodError) {
  const errors: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!errors[key]) errors[key] = issue.message;
  }
  return errors;
}
