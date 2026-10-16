import { Resend } from "resend";
import { profile } from "@/content/profile";

type ContactMail = {
  name: string;
  email: string;
  message: string;
  interests: string[];
};

export async function sendContactEmail(input: ContactMail) {
  if (process.env.RESEND_ENABLED !== "true") return false;

  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.RESEND_FROM?.trim();
  const to = process.env.CONTACT_TO_EMAIL?.trim() || profile.email;

  if (!apiKey || !from) {
    console.error("Resend is enabled but RESEND_API_KEY or RESEND_FROM is missing.");
    return false;
  }

  const resend = new Resend(apiKey);
  const safeName = input.name.replace(/[\r\n]+/g, " ").slice(0, 80);
  const interestLine = input.interests.length > 0 ? input.interests.join(", ") : "None";

  const { error } = await resend.emails.send({
    from,
    to,
    replyTo: input.email,
    subject: `Portfolio note from ${safeName}`,
    text: [
      `Name: ${input.name}`,
      `Email: ${input.email}`,
      `Interests: ${interestLine}`,
      "",
      input.message,
    ].join("\n"),
  });

  if (error) {
    console.error("Contact email was not sent.");
    return false;
  }

  return true;
}
