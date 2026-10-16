"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";
import { profile } from "@/content/profile";
import { runCommand, type TerminalLine } from "@/lib/terminal";

const INTRO: TerminalLine[] = [
  { kind: "command", text: "visitor@mzoughi:~$ hello" },
  { kind: "output", text: profile.name },
  { kind: "output", text: `${profile.title} · ${profile.years} years · Tunis` },
  { kind: "output", text: "Type help, or use the links under this window." },
];

export function Terminal({ onHire }: { onHire: () => void }) {
  const reduce = useReducedMotion();
  const [lines, setLines] = useState<TerminalLine[]>([]);
  const [ready, setReady] = useState(false);
  const shown = reduce ? INTRO : lines;
  const inputReady = reduce === true || ready;
  const [value, setValue] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [live, setLive] = useState("");
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (reduce !== false) return;

    let lineIndex = 0;
    let charIndex = 0;
    const typed: TerminalLine[] = [];
    let cancelled = false;
    let timer = 0;

    function step() {
      if (cancelled) return;
      const source = INTRO[lineIndex];
      charIndex += 1;
      const partial = source.text.slice(0, charIndex);
      setLines([...typed, { kind: source.kind, text: partial }]);

      if (charIndex < source.text.length) {
        timer = window.setTimeout(step, source.kind === "command" ? 18 : 12);
        return;
      }

      typed.push(source);
      setLive(source.text);
      lineIndex += 1;
      charIndex = 0;
      if (lineIndex >= INTRO.length) {
        setReady(true);
        return;
      }
      timer = window.setTimeout(step, 220);
    }

    timer = window.setTimeout(step, 280);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [reduce]);

  useEffect(() => {
    const node = outputRef.current;
    if (node) node.scrollTop = node.scrollHeight;
  }, [lines]);

  function submit(command: string) {
    const trimmed = command.trim();
    if (!trimmed) return;
    if (trimmed.toLowerCase() === "clear") {
      setLines([]);
      setValue("");
      setLive("Screen cleared.");
      return;
    }

    const result = runCommand(trimmed);
    setLines((current) => [
      ...current,
      { kind: "command", text: `visitor@mzoughi:~$ ${trimmed}` },
      ...result.lines,
    ]);
    setHistory((current) => [trimmed, ...current].slice(0, 20));
    setHistoryIndex(-1);
    setValue("");
    setLive(result.lines.map((line) => line.text).join(" "));

    if (trimmed.toLowerCase() === "hire") onHire();
    if (result.href) {
      document.querySelector(result.href)?.scrollIntoView({
        behavior: reduce ? "auto" : "smooth",
        block: "start",
      });
    }
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      const next = Math.min(historyIndex + 1, history.length - 1);
      if (next >= 0) {
        setHistoryIndex(next);
        setValue(history[next] ?? "");
      }
    }
    if (event.key === "ArrowDown") {
      event.preventDefault();
      const next = historyIndex - 1;
      if (next < 0) {
        setHistoryIndex(-1);
        setValue("");
      } else {
        setHistoryIndex(next);
        setValue(history[next] ?? "");
      }
    }
  }

  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-surface shadow-[var(--shadow)]">
      <div className="flex items-center gap-2 border-b border-line px-4 py-3">
        <span className="size-2.5 rounded-full bg-[#ff8b7a]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-[#e7c15a]" aria-hidden="true" />
        <span className="size-2.5 rounded-full bg-accent" aria-hidden="true" />
        <span className="ml-2 font-mono text-xs text-muted">visitor@mzoughi:~</span>
      </div>
      <div
        ref={outputRef}
        className="max-h-72 min-h-52 space-y-1.5 overflow-auto px-4 py-4 font-mono text-sm leading-6"
        aria-hidden={live ? true : undefined}
      >
        {shown.map((line, index) => (
          <p
            key={`${index}-${line.text}`}
            className={
              line.kind === "command" ? "text-accent-text" : line.kind === "error" ? "text-danger" : "text-ink"
            }
          >
            {line.text}
          </p>
        ))}
        <noscript>
          <p>
            {profile.name}, {profile.title} in Tunis. Use the links below this window.
          </p>
        </noscript>
      </div>
      <p className="sr-only" aria-live="polite">
        {reduce ? INTRO.map((line) => line.text).join(" ") : live}
      </p>
      <form
        className="border-t border-line px-4 py-3"
        onSubmit={(event) => {
          event.preventDefault();
          if (inputReady) submit(value);
        }}
      >
        <label className="flex items-center gap-2 font-mono text-sm">
          <span className="text-accent-text" aria-hidden="true">
            $
          </span>
          <span className="sr-only">Terminal command</span>
          <input
            ref={inputRef}
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onKeyDown={onKeyDown}
            disabled={!inputReady}
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck={false}
            className="w-full bg-transparent text-ink outline-none disabled:opacity-60"
            placeholder={inputReady ? "help" : "Starting…"}
          />
        </label>
      </form>
    </div>
  );
}
