"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";

// Every streamed boundary hydrates in the server language before adopting the saved preference.
const getServerLanguage = () => "th" as const;

export function useI18n() {
  const { i18n } = useTranslation();
  const subscribe = useCallback((onChange: () => void) => {
    i18n.on("languageChanged", onChange);
    return () => { i18n.off("languageChanged", onChange); };
  }, [i18n]);
  const getLanguage = useCallback(() => i18n.resolvedLanguage === "en" ? "en" as const : "th" as const, [i18n]);
  const language = useSyncExternalStore(subscribe, getLanguage, getServerLanguage);
  const translate = i18n.getFixedT(language);

  function t(key: string, options?: Record<string, string | number>) {
    if (i18n.exists(key)) return String(translate(key, options));
    return key.split(" · ").map(part => String(translate(part, options))).join(" · ");
  }
  return { t, language, changeLanguage: (locale: "th" | "en") => i18n.changeLanguage(locale) };
}
