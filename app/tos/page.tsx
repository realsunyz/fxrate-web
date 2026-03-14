"use client";

import { useEffect, useState, type ComponentType, type MouseEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useI18n, type Locale } from "@/lib/i18n";
import TosEn from "./tos.en.mdx";
import TosZh from "./tos.zh.mdx";

const localeContent: Record<Locale, ComponentType> = {
  en: TosEn,
  zh: TosZh,
};

export default function TermsOfServicePage() {
  const { locale, t } = useI18n();
  const Content = localeContent[locale] ?? TosZh;
  const router = useRouter();
  const [isVisible, setIsVisible] = useState(true);
  const [isNavigating, setIsNavigating] = useState(false);
  const exitDurationMs = 280;

  useEffect(() => {
    if (isNavigating && !isVisible) {
      const timeout = setTimeout(() => {
        router.push("/");
      }, exitDurationMs);
      return () => clearTimeout(timeout);
    }
  }, [isNavigating, isVisible, router]);

  const handleBack = (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (isNavigating) return;
    setIsNavigating(true);
    setIsVisible(false);
  };

  return (
    <div className="flex w-full px-4">
      <div className="container mx-auto">
        <AnimatePresence mode="wait">
          {isVisible && (
            <motion.section
              key="tos-content"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.28, ease: "easeOut" }}
              className="mx-auto max-w-3xl py-12"
            >
              <header className="mb-8 flex items-center justify-between">
                <Link
                  href="/"
                  onClick={handleBack}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{t("tos.back")}</span>
                </Link>
              </header>
              <article className="leading-relaxed text-foreground [&_a]:text-primary [&_a]:underline [&_em]:text-sm [&_h1]:mb-6 [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-tight [&_h2]:mb-4 [&_h2]:mt-8 [&_h2]:text-2xl [&_h2]:font-semibold [&_h3]:mt-6 [&_h3]:text-xl [&_h3]:font-semibold [&_li]:mt-2 [&_p]:mt-4 [&_p]:text-base [&_strong]:font-semibold [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
                <Content />
              </article>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
