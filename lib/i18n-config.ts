export const SUPPORTED_LOCALES = ["zh", "en"] as const;

export type Locale = (typeof SUPPORTED_LOCALES)[number];

export const DEFAULT_LOCALE: Locale = "zh";
export const LOCALE_COOKIE_NAME = "locale";
export const LOCALE_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export const HTML_LANG_BY_LOCALE: Record<Locale, string> = {
  zh: "zh-Hans",
  en: "en",
};

export function isLocale(value: string | null | undefined): value is Locale {
  return value === "zh" || value === "en";
}

export function normalizeLocale(value: string | null | undefined): Locale | null {
  if (!value) return null;

  const normalized = value.trim().toLowerCase().replaceAll("_", "-");
  if (normalized.startsWith("zh")) return "zh";
  if (normalized.startsWith("en")) return "en";

  return isLocale(normalized) ? normalized : null;
}

export function resolveLocale({
  cookieLocale,
  acceptLanguage,
}: {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
}): Locale {
  return normalizeLocale(cookieLocale) ?? parseAcceptLanguage(acceptLanguage) ?? DEFAULT_LOCALE;
}

function parseAcceptLanguage(value: string | null | undefined): Locale | null {
  if (!value) return null;

  for (const entry of value.split(",")) {
    const candidate = entry.split(";")[0]?.trim();
    const locale = normalizeLocale(candidate);
    if (locale) return locale;
  }

  return null;
}
