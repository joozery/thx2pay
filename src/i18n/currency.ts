import type { Language } from "./languages";

// All prices in the app are stored in Thai baht. Each language shows them in a local currency.
// `fallbackRate` (units per 1 THB) is only used when the live rates in exchangeRates.ts can't be fetched.
export const currencies = {
  th: { code: "THB", fallbackRate: 1, digits: 2 },
  en: { code: "USD", fallbackRate: 0.0298, digits: 2 },
  zh: { code: "CNY", fallbackRate: 0.2, digits: 2 },
  id: { code: "IDR", fallbackRate: 539, digits: 0 },
  fil: { code: "PHP", fallbackRate: 1.88, digits: 2 },
  ko: { code: "KRW", fallbackRate: 40.6, digits: 0 },
  ar: { code: "SAR", fallbackRate: 0.112, digits: 2 },
} as const satisfies Record<Language, { code: string; fallbackRate: number; digits: number }>;

export type CurrencyCode = (typeof currencies)[Language]["code"];
/** Units of each currency per 1 THB. */
export type ExchangeRates = Record<CurrencyCode, number>;

export const fallbackRates = Object.fromEntries(
  Object.values(currencies).map(currency => [currency.code, currency.fallbackRate]),
) as ExchangeRates;

export type MoneyOptions = {
  /** Always show the currency's minor units (e.g. balances: ฿0.00, $0.00). */
  fixed?: boolean;
};

export function formatMoney(amountTHB: number, language: Language, locale: string, rates: ExchangeRates, options: MoneyOptions = {}) {
  const currency = currencies[language];
  const value = amountTHB * (rates[currency.code] ?? currency.fallbackRate);
  // Whole baht stays whole; converted amounts keep cents so small prices don't collapse to $0.
  const showFraction = options.fixed || (currency.code !== "THB" && currency.digits > 0) || !Number.isInteger(value);
  const digits = showFraction ? currency.digits : 0;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: currency.code,
    currencyDisplay: "narrowSymbol",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
}
