// Cookie consent stored in this browser only. Read `getCookieConsent()` before loading any
// analytics or marketing script; "necessary" cookies (login, language, theme) are always on.
export type CookieConsent = { necessary: true; analytics: boolean; marketing: boolean; savedAt: string };

const KEY = "thx2pay-cookie-consent";
export const OPEN_EVENT = "thx2pay-open-cookie-settings";
const CHANGE_EVENT = "thx2pay-cookie-consent-change";

export function readConsentRaw(): string | null {
  try { return localStorage.getItem(KEY); } catch { return null; }
}

export function getCookieConsent(): CookieConsent | null {
  const raw = readConsentRaw();
  if (!raw) return null;
  try { return JSON.parse(raw) as CookieConsent; } catch { return null; }
}

export function saveCookieConsent(choice: { analytics: boolean; marketing: boolean }) {
  const value: CookieConsent = { necessary: true, ...choice, savedAt: new Date().toISOString() };
  try { localStorage.setItem(KEY, JSON.stringify(value)); } catch { /* storage blocked: banner shows again next visit */ }
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return value;
}

export function subscribeConsent(callback: () => void) {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(CHANGE_EVENT, callback); window.removeEventListener("storage", callback); };
}

export const openCookieSettings = () => window.dispatchEvent(new Event(OPEN_EVENT));
