"use client";

import { Suspense, useEffect, useState, type ReactNode } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import th from "./locales/th.json";
import en from "./locales/en.json";
import zh from "./locales/zh.json";
import id from "./locales/id.json";
import fil from "./locales/fil.json";
import ko from "./locales/ko.json";
import ar from "./locales/ar.json";
import { isLanguage, languageCodes, languageInfo, type Language } from "./languages";
import DocumentMeta from "./DocumentMeta";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [instance] = useState(() => {
    const i18n = createInstance().use(initReactI18next);
    void i18n.init({
      resources: { th: { translation: th }, en: { translation: en }, zh: { translation: zh }, id: { translation: id }, fil: { translation: fil }, ko: { translation: ko }, ar: { translation: ar } },
      lng: "th",
      // Missing strings fall back to English first (more widely understood than Thai), then Thai.
      fallbackLng: { th: [], en: ["th"], default: ["en", "th"] },
      supportedLngs: languageCodes,
      initAsync: false,
      keySeparator: false,
      nsSeparator: false,
      interpolation: { escapeValue: false },
      react: { useSuspense: false },
    });
    return i18n;
  });

  useEffect(() => {
    function syncLanguage(language: string) {
      const locale: Language = isLanguage(language) ? language : "th";
      document.documentElement.lang = locale;
      document.documentElement.dir = languageInfo(locale).dir;
      try { localStorage.setItem("thx2pay-language", locale); } catch { /* Language switching works without storage. */ }
    }
    function handleStorage(event: StorageEvent) {
      if (event.key !== "thx2pay-language" && event.key !== null) return;
      const locale: Language = isLanguage(event.newValue) ? event.newValue : "th";
      if (instance.resolvedLanguage !== locale) void instance.changeLanguage(locale);
    }
    let locale: Language = "th";
    try { const saved = localStorage.getItem("thx2pay-language"); if (isLanguage(saved)) locale = saved; } catch { /* Keep the default language. */ }
    instance.on("languageChanged", syncLanguage);
    if (instance.resolvedLanguage !== locale) void instance.changeLanguage(locale);
    else syncLanguage(locale);
    window.addEventListener("storage", handleStorage);
    return () => {
      instance.off("languageChanged", syncLanguage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [instance]);

  return <I18nextProvider i18n={instance}><Suspense fallback={null}><DocumentMeta /></Suspense>{children}</I18nextProvider>;
}
