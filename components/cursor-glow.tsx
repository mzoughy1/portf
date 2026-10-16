"use client";

import { useEffect, useRef } from "react";

export function CursorGlow() {
  const light = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduce.matches) return;

    document.documentElement.classList.add("custom-cursor");

    const onMove = (event: PointerEvent) => {
      const position = `translate3d(${event.clientX}px, ${event.clientY}px, 0) translate(-50%, -50%)`;
      if (light.current) {
        light.current.style.opacity = "1";
        light.current.style.transform = position;
      }
      if (dot.current) {
        dot.current.style.opacity = "1";
        dot.current.style.transform = position;
      }
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      document.documentElement.classList.remove("custom-cursor");
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return (
    <div aria-hidden="true" className="cursor-layer">
      <div ref={light} className="cursor-light" />
      <div ref={dot} className="cursor-dot" />
    </div>
  );
}
