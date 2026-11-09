"use client";

import { useCallback, useSyncExternalStore } from "react";
import { useTranslation } from "react-i18next";
import { isLanguage, languageInfo, type Language } from "./languages";
import { currencies, formatMoney, type MoneyOptions } from "./currency";
import { useExchangeRates } from "./ratesContext";

// Every streamed boundary hydrates in the server language before adopting the saved preference.
const getServerLanguage = (): Language => "th";

export function useI18n() {
  const { i18n } = useTranslation();
  const subscribe = useCallback((onChange: () => void) => {
    i18n.on("languageChanged", onChange);
    return () => { i18n.off("languageChanged", onChange); };
  }, [i18n]);
  const getLanguage = useCallback((): Language => isLanguage(i18n.resolvedLanguage) ? i18n.resolvedLanguage : "th", [i18n]);
  const language = useSyncExternalStore(subscribe, getLanguage, getServerLanguage);
  const rates = useExchangeRates();
  const translate = i18n.getFixedT(language);

  function t(key: string, options?: Record<string, string | number>) {
    if (i18n.exists(key)) return String(translate(key, options));
    return key.split(" · ").map(part => String(translate(part, options))).join(" · ");
  }
  const locale = languageInfo(language).intl;
  // `money` formats a baht amount in the current language's currency (THB → USD, KRW, …).
  const money = (amountTHB: number, options?: MoneyOptions) => formatMoney(amountTHB, language, locale, rates, options);
  // `locale` is the Intl locale for numbers and dates (e.g. "th-TH", "ko-KR").
  return { t, language, locale, dir: languageInfo(language).dir, currency: currencies[language].code, money, changeLanguage: (code: Language) => i18n.changeLanguage(code) };
}
