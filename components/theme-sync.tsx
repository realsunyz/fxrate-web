"use client";

import { useEffect } from "react";
import { useTheme } from "next-themes";
import { META_THEME_COLORS } from "@/config/site";

export function ThemeSync() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    const color = resolvedTheme !== "dark" ? META_THEME_COLORS.light : META_THEME_COLORS.dark;
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", color);
  }, [resolvedTheme]);

  return null;
}
