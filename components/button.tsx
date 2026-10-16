import { cn } from "@/lib/utils";

export function buttonClass(variant: "solid" | "ghost", emphasized = false) {
  return cn(
    "inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition",
    variant === "solid"
      ? "bg-accent text-accent-ink hover:brightness-105"
      : "border border-line bg-surface text-ink hover:border-accent-text",
    emphasized && "ring-2 ring-accent ring-offset-2 ring-offset-bg",
    "disabled:cursor-not-allowed disabled:opacity-60",
  );
}

export function ButtonLink({
  href,
  children,
  variant = "ghost",
  emphasized = false,
  external = false,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "solid" | "ghost";
  emphasized?: boolean;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      className={buttonClass(variant, emphasized)}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </a>
  );
}
