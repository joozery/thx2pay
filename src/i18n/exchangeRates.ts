import { cacheLife } from "next/cache";
import { fallbackRates, type CurrencyCode, type ExchangeRates } from "./currency";

const RATES_URL = "https://open.er-api.com/v6/latest/THB";

/** THB-based exchange rates, fetched on the server and cached for a day. */
export async function getExchangeRates(): Promise<ExchangeRates> {
  "use cache";
  cacheLife("days");
  try {
    const response = await fetch(RATES_URL, { signal: AbortSignal.timeout(5000) });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as { result?: string; rates?: Record<string, number> };
    if (data.result !== "success" || !data.rates) throw new Error("Unexpected response");
    const rates = { ...fallbackRates };
    for (const code of Object.keys(rates) as CurrencyCode[]) {
      const rate = data.rates[code];
      if (typeof rate === "number" && rate > 0) rates[code] = rate;
    }
    rates.THB = 1;
    return rates;
  } catch (error) {
    console.warn("[exchange-rates] Using fallback rates:", error);
    return fallbackRates;
  }
}
