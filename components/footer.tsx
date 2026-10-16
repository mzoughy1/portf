import { profile } from "@/content/profile";

export function Footer() {
  const links = [
    profile.github ? { href: profile.github, label: "GitHub", external: true } : null,
    { href: profile.linkedin, label: "LinkedIn", external: true },
    { href: `mailto:${profile.email}`, label: "Email", external: false },
    { href: profile.phoneHref, label: profile.phone, external: false },
  ].filter((link): link is { href: string; label: string; external: boolean } => Boolean(link));

  return (
    <footer className="border-t border-line px-5 py-10 md:px-8">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-display text-2xl text-ink">{profile.name}</p>
          <p className="mt-1 text-sm text-muted">{profile.location}</p>
        </div>
        <ul className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
          {links.map((link) => (
            <li key={link.label}>
              <a
                href={link.href}
                className="text-ink underline decoration-line underline-offset-4 hover:decoration-accent"
                {...(link.external ? { target: "_blank", rel: "me noopener noreferrer" } : { rel: "me" })}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
