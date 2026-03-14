"use client";

import { useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";

declare global {
  interface Window {
    turnstile?: {
      render: (
        el: HTMLElement | string,
        options: {
          sitekey: string;
          callback?: (token: string) => void;
          "error-callback"?: () => void;
          "expired-callback"?: () => void;
          theme?: "auto" | "light" | "dark";
          appearance?: "always" | "execute" | "interaction-only";
          language?: string;
        },
      ) => string | undefined;
      reset?: (id?: string) => void;
    };
  }
}

type CaptchaWidgetProps = {
  onVerify: (token: string) => void;
  siteKey?: string;
  theme?: "auto" | "light" | "dark";
  language?: string;
};

export function CaptchaWidget({ onVerify, siteKey, theme = "auto", language }: CaptchaWidgetProps) {
  const { locale } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const idRef = useRef<string | undefined>(undefined);
  const resolvedSiteKey = siteKey || process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY || "";
  const resolvedLanguage = language || (locale === "zh" ? "zh-cn" : "en");

  useEffect(() => {
    let cancelled = false;
    const container = containerRef.current;

    const tryRender = () => {
      if (!container || !window.turnstile || !resolvedSiteKey) {
        return;
      }
      try {
        container.innerHTML = "";
      } catch {}
      const id = window.turnstile.render(container, {
        sitekey: resolvedSiteKey,
        theme,
        language: resolvedLanguage,
        callback: (token: string) => {
          if (!cancelled) onVerify(token);
        },
        "error-callback": () => {},
        "expired-callback": () => {
          window.turnstile?.reset?.(typeof id === "string" ? id : undefined);
        },
      });
      idRef.current = typeof id === "string" ? id : undefined;
    };

    const start = Date.now();
    const interval = setInterval(() => {
      if (window.turnstile) {
        clearInterval(interval);
        tryRender();
      } else if (Date.now() - start > 5000) {
        clearInterval(interval);
      }
    }, 100);

    return () => {
      cancelled = true;
      clearInterval(interval);
      try {
        if (window.turnstile?.reset) {
          if (typeof idRef.current === "string") {
            window.turnstile.reset(idRef.current);
          } else {
            window.turnstile.reset();
          }
        }
      } catch {}
      try {
        if (container) container.innerHTML = "";
      } catch {}
    };
  }, [resolvedSiteKey, theme, resolvedLanguage, onVerify]);

  if (!resolvedSiteKey) {
    return (
      <div className="text-red-500 text-center text-sm text-muted-foreground">
        Invalid Turnstile Site Key (ERR-C999)
      </div>
    );
  }

  return <div ref={containerRef} className="flex items-center justify-center" />;
}

export default CaptchaWidget;
