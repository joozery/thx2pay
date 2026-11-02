// Supported languages. Thai is the source language (the translation keys are Thai text).
export const languages = [
  { code: "th", label: "ภาษาไทย", short: "TH", flag: "th", intl: "th-TH", dir: "ltr" },
  { code: "en", label: "English", short: "EN", flag: "gb", intl: "en-US", dir: "ltr" },
  { code: "zh", label: "简体中文", short: "中文", flag: "cn", intl: "zh-CN", dir: "ltr" },
  { code: "id", label: "Bahasa Indonesia", short: "ID", flag: "id", intl: "id-ID", dir: "ltr" },
  { code: "fil", label: "Filipino", short: "FIL", flag: "ph", intl: "fil-PH", dir: "ltr" },
  { code: "ko", label: "한국어", short: "KO", flag: "kr", intl: "ko-KR", dir: "ltr" },
  { code: "ar", label: "العربية", short: "AR", flag: "sa", intl: "ar", dir: "rtl" },
] as const;

export type Language = (typeof languages)[number]["code"];
export const languageCodes = languages.map(language => language.code) as Language[];
export const isLanguage = (value: unknown): value is Language => typeof value === "string" && (languageCodes as string[]).includes(value);
export const languageInfo = (code: Language) => languages.find(language => language.code === code)!;
