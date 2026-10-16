"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    const onMove = (event: PointerEvent) => {
      node.style.opacity = "1";
      node.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-30 opacity-0"
    >
      <div className="size-56 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle,var(--accent)_0%,transparent_68%)] opacity-20" />
    </div>
  );
}
