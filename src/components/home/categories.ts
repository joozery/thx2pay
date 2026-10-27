import en from "@/i18n/locales/en.json";
import { platforms, type Platform } from "./types";

export type Category = { label: string; image: string; platform: Platform };

const platformAliases: Record<Platform, string> = {
  Mobile: "มือถือ โมบาย",
  Console: "คอนโซล จอย",
  "PC Games": "คอม คอมพิวเตอร์ พีซี",
  "Gift Card": "บัตร ของขวัญ กิฟต์การ์ด",
};

export function getCategories(platform: Platform): Category[] {
  const labels = platform === "Gift Card" ? ["บัตรเติมเงิน", "บัตรของขวัญ", "โค้ดเกม"] : ["เติมเกม", "ไอดีเกม", "ไอเทม & สกิน"];
  const images = ["/images/games/category-topup.webp", "/images/games/category-accounts.webp", "/images/games/category-items.webp"];
  return labels.map((label, index) => ({ label, image: images[index], platform }));
}

export const allCategories = platforms.flatMap(getCategories);

export function matchesCategory(category: Category, query: string) {
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const translatedLabel = (en as Record<string, string>)[category.label] ?? category.label;
  const text = `${category.label} ${translatedLabel} ${category.platform} ${platformAliases[category.platform]}`.toLocaleLowerCase();
  return words.every(word => text.includes(word));
}
