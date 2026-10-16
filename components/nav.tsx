"use client";

import { useEffect, useState } from "react";
import { ThemeToggle } from "@/components/theme-toggle";
import { cn } from "@/lib/utils";

const links = [
  { href: "#about", id: "about", label: "About" },
  { href: "#experience", id: "experience", label: "Experience" },
  { href: "#projects", id: "projects", label: "Work" },
  { href: "#skills", id: "skills", label: "Skills" },
  { href: "#guestbook", id: "guestbook", label: "Guestbook" },
  { href: "#contact", id: "contact", label: "Contact" },
];

export function Nav() {
  const [active, setActive] = useState("top");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const nodes = links
      .map((link) => document.getElementById(link.id))
      .filter((node): node is HTMLElement => Boolean(node));

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target.id) setActive(visible.target.id);
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: [0.1, 0.25, 0.5] },
    );

    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="nav-surface fixed inset-x-0 top-0 z-40 border-b border-line">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 md:px-8">
        <a href="#top" className="font-display text-xl tracking-tight text-ink">
          Mzoughi
        </a>
        <nav className="hidden items-center gap-6 md:flex" aria-label="Page">
          {links.map((link) => (
            <a
              key={link.id}
              href={link.href}
              aria-current={active === link.id ? "location" : undefined}
              className={cn("text-sm text-muted hover:text-ink", active === link.id && "text-accent-text")}
            >
              {link.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 items-center rounded-full border border-line px-3 text-sm md:hidden"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen((value) => !value)}
          >
            {open ? "Close" : "Menu"}
          </button>
        </div>
      </div>
      {open ? (
        <nav id="site-menu" className="border-t border-line px-5 py-4 md:hidden" aria-label="Page">
          <ul className="grid gap-1">
            {links.map((link) => (
              <li key={link.id}>
                <a
                  href={link.href}
                  className="block rounded-xl px-3 py-3 text-ink hover:bg-surface"
                  onClick={() => setOpen(false)}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
