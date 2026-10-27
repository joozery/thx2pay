"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createInstance } from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";
import th from "./locales/th.json";
import en from "./locales/en.json";

export default function I18nProvider({ children }: { children: ReactNode }) {
  const [instance] = useState(() => {
    const i18n = createInstance().use(initReactI18next);
    void i18n.init({
      resources: { th: { translation: th }, en: { translation: en } },
      lng: "th",
      fallbackLng: "th",
      supportedLngs: ["th", "en"],
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
      const locale = language === "en" ? "en" : "th";
      document.documentElement.lang = locale;
      document.title = locale === "en" ? "THX2PAY | Fast, secure game top-ups" : "THX2PAY | เติมเกมออนไลน์ รวดเร็ว ปลอดภัย";
      try { localStorage.setItem("thx2pay-language", locale); } catch { /* Language switching works without storage. */ }
    }
    function handleStorage(event: StorageEvent) {
      if (event.key !== "thx2pay-language" && event.key !== null) return;
      const locale = event.newValue === "en" ? "en" : "th";
      if (instance.resolvedLanguage !== locale) void instance.changeLanguage(locale);
    }
    let locale = "th";
    try { locale = localStorage.getItem("thx2pay-language") === "en" ? "en" : "th"; } catch { /* Keep the default language. */ }
    instance.on("languageChanged", syncLanguage);
    if (instance.resolvedLanguage !== locale) void instance.changeLanguage(locale);
    else syncLanguage(locale);
    window.addEventListener("storage", handleStorage);
    return () => {
      instance.off("languageChanged", syncLanguage);
      window.removeEventListener("storage", handleStorage);
    };
  }, [instance]);

  return <I18nextProvider i18n={instance}>{children}</I18nextProvider>;
}
