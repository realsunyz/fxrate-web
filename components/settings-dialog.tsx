"use client";

import * as React from "react";
import { CircleQuestionMark, Languages, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/animate-ui/components/radix/dialog";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

export function SettingsDialog() {
  const { t, locale, setLocale } = useI18n();
  const [open, setOpen] = React.useState(false);

  const nextLocale = locale === "zh" ? "en" : "zh";
  const languageButtonLabel = t("settings.switchLanguage");
  const [languageIconState, setLanguageIconState] = React.useState<"language" | "success">(
    "language",
  );
  const languageIconTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleToggleLanguage = () => {
    setLocale(nextLocale);
    if (languageIconTimeoutRef.current) {
      clearTimeout(languageIconTimeoutRef.current);
      languageIconTimeoutRef.current = null;
    }
    setLanguageIconState("success");
    languageIconTimeoutRef.current = setTimeout(() => {
      setLanguageIconState("language");
      languageIconTimeoutRef.current = null;
    }, 900);
  };

  React.useEffect(() => {
    return () => {
      if (languageIconTimeoutRef.current) {
        clearTimeout(languageIconTimeoutRef.current);
      }
    };
  }, []);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className="h-8 w-8 px-0"
          aria-label={t("help.title")}
          title={t("help.title")}
        >
          <CircleQuestionMark className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent style={{ x: "-50%", y: "-50%" }}>
        <DialogHeader>
          <DialogTitle>{t("help.title")}</DialogTitle>
          <DialogDescription>{t("help.description")}</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <div className="text-sm font-medium mb-2">{t("help.info.title")}</div>
            <ul className="text-sm list-disc pl-5 space-y-1">
              <li>{t("help.info.line1")}</li>
              <li>{t("help.info.line2")}</li>
              <li>{t("help.info.line3")}</li>
            </ul>
          </div>
          <div>
            <div className="text-sm font-medium mb-2">{t("settings.preferences")}</div>
            <div className="flex flex-wrap gap-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 rounded-full px-3 gap-2"
                onClick={handleToggleLanguage}
              >
                <span className="relative h-4 w-4 overflow-hidden">
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out",
                      languageIconState === "language"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 -translate-y-1",
                    )}
                  >
                    <Languages className="h-4 w-4" />
                  </span>
                  <span
                    className={cn(
                      "absolute inset-0 flex items-center justify-center transition-all duration-200 ease-out",
                      languageIconState === "success"
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-1",
                    )}
                  >
                    <Check className="h-4 w-4 text-emerald-500" />
                  </span>
                </span>
                <span className="flex items-center whitespace-nowrap">{languageButtonLabel}</span>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
