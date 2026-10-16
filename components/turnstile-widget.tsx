"use client";

import { useEffect, useRef } from "react";
import { useTheme } from "@/components/providers";

type TurnstileApi = {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string;
      theme: "light" | "dark";
      callback: (token: string) => void;
      "expired-callback": () => void;
      "error-callback": () => void;
    },
  ) => string;
  remove: (widgetId: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileApi;
  }
}

export function turnstileSiteKey() {
  return process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() || "";
}

export function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const siteKey = turnstileSiteKey();
  const { theme } = useTheme();
  const holder = useRef<HTMLDivElement>(null);
  const onTokenRef = useRef(onToken);

  useEffect(() => {
    onTokenRef.current = onToken;
  }, [onToken]);

  useEffect(() => {
    if (!siteKey || !holder.current) return;
    const element = holder.current;
    let widgetId = "";
    let cancelled = false;
    let timer = 0;

    function render() {
      if (cancelled || !window.turnstile) return;
      if (widgetId) window.turnstile.remove(widgetId);
      element.replaceChildren();
      widgetId = window.turnstile.render(element, {
        sitekey: siteKey,
        theme: document.documentElement.dataset.theme === "light" ? "light" : "dark",
        callback: (token) => onTokenRef.current(token),
        "expired-callback": () => onTokenRef.current(""),
        "error-callback": () => onTokenRef.current(""),
      });
    }

    if (window.turnstile) {
      render();
    } else {
      const existing = document.querySelector<HTMLScriptElement>("script[data-turnstile]");
      if (!existing) {
        const script = document.createElement("script");
        script.src = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
        script.async = true;
        script.dataset.turnstile = "true";
        script.onload = () => render();
        document.head.appendChild(script);
      } else {
        timer = window.setInterval(() => {
          if (window.turnstile) {
            window.clearInterval(timer);
            render();
          }
        }, 200);
      }
    }

    return () => {
      cancelled = true;
      window.clearInterval(timer);
      if (widgetId && window.turnstile) window.turnstile.remove(widgetId);
    };
  }, [siteKey, theme]);

  if (!siteKey) return null;
  return <div ref={holder} className="min-h-16" />;
}
