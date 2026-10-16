import { profile } from "@/content/profile";
import { skillGroups } from "@/content/skills";
import { getSiteUrl } from "@/lib/site";

export function personJsonLd() {
  const sameAs = [profile.linkedin, profile.github].filter(Boolean);
  const siteUrl = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    givenName: profile.givenName,
    familyName: profile.familyName,
    jobTitle: profile.title,
    email: profile.email,
    telephone: "+21695373448",
    url: siteUrl,
    address: {
      "@type": "PostalAddress",
      addressLocality: profile.locality,
      addressCountry: profile.country,
    },
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name: profile.education.school,
    },
    knowsAbout: skillGroups.flatMap((group) => group.skills),
    sameAs,
    description: profile.summary.join(" "),
  };
}
