"use client";
import { useI18n } from "@/lib/i18n";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="flex w-full mt-6 mb-10 px-4">
      <div className="container mx-auto text-center text-sm text-gray-500">
        <div>
          {t("footer.build", {
            version: process.env.APP_VERSION || "dev",
            id: process.env.COMMIT_ID || "dev",
          })}
        </div>
        <div>{t("footer.copyright")}</div>
      </div>
    </footer>
  );
}
