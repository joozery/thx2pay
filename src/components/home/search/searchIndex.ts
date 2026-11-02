import { games } from "@/components/topup/games";
import { premiumApps } from "@/components/home/premiumApps";

export type SearchKind = "game" | "premium" | "page";
export type SearchItem = {
  id: string;
  kind: SearchKind;
  title: string;
  subtitle: string;
  href: string;
  image?: string;
  color?: string;
  icon?: PageIcon;
  gameId?: string;
  keywords: string;
};
export type PageIcon = "topup" | "card" | "wallet" | "partner" | "premium" | "promo" | "news" | "help" | "uid" | "contact" | "history" | "account";

const pages: Omit<SearchItem, "kind" | "keywords">[] = [
  { id: "page-topup", title: "เติมเกม", subtitle: "เติมเกมด้วย UID", href: "/topup", icon: "topup" },
  { id: "page-cards", title: "บัตรเติมเงิน", subtitle: "บัตรเติมเกม บัตรของขวัญ โค้ดเกม", href: "/cards", icon: "card" },
  { id: "page-wallet", title: "เติมเงินเข้ากระเป๋า", subtitle: "เติมยอดเงินไว้ใช้บนเว็บ", href: "/wallet/topup", icon: "wallet" },
  { id: "page-premium", title: "แอพพรีเมียม", subtitle: "Netflix, Spotify, YouTube และอื่น ๆ", href: "/premium", icon: "premium" },
  { id: "page-promotions", title: "โปรโมชั่น", subtitle: "ดีลและคูปองล่าสุด", href: "/promotions", icon: "promo" },
  { id: "page-partner", title: "สมัครตัวแทนจำหน่าย", subtitle: "รับราคาพิเศษสำหรับตัวแทน", href: "/partner", icon: "partner" },
  { id: "page-uid", title: "วิธีหา UID", subtitle: "ดูวิธีหา UID หรือ Player ID ในเกม", href: "/help", icon: "uid" },
  { id: "page-help", title: "ช่วยเหลือ", subtitle: "คำถามที่พบบ่อย", href: "/help", icon: "help" },
  { id: "page-history", title: "คำสั่งซื้อ", subtitle: "ประวัติการเติมและสถานะ", href: "/account/orders", icon: "history" },
  { id: "page-account", title: "บัญชีของฉัน", subtitle: "โปรไฟล์และการตั้งค่า", href: "/account", icon: "account" },
  { id: "page-news", title: "ข่าวสาร", subtitle: "ประกาศและอัปเดต", href: "/news", icon: "news" },
  { id: "page-contact", title: "ติดต่อเรา", subtitle: "อีเมลและเวลาให้บริการ", href: "/contact", icon: "contact" },
];

const pageAliases: Record<string, string> = {
  "page-topup": "topup game เติม uid", "page-cards": "card gift code บัตร ของขวัญ โค้ด", "page-wallet": "wallet กระเป๋า ยอดเงิน balance",
  "page-premium": "premium netflix spotify youtube app แอป", "page-promotions": "promotion promo coupon คูปอง ส่วนลด ดีล",
  "page-partner": "partner reseller ตัวแทน", "page-uid": "uid player id ไอดี", "page-help": "help faq ถาม", "page-history": "history order ออเดอร์ คำสั่งซื้อ ประวัติการเติม",
  "page-account": "account profile โปรไฟล์ บัญชี ตั้งค่า", "page-news": "news ข่าว", "page-contact": "contact email อีเมล ติดต่อ",
};

export const searchIndex: SearchItem[] = [
  ...games.map(game => ({ id: `game-${game.id}`, kind: "game" as const, title: game.name, subtitle: `${game.genre} · ${game.platforms.join(", ")}`, href: `/topup?game=${game.id}`, image: game.icon, gameId: game.id, keywords: `${game.name} ${game.aliases} ${game.publisher ?? ""} ${game.genre} ${game.platforms.join(" ")}` })),
  ...premiumApps.map(app => ({ id: `premium-${app.id}`, kind: "premium" as const, title: app.name, subtitle: app.category, href: "/premium", image: app.logo, color: app.color, keywords: `${app.name} ${app.category} premium พรีเมียม` })),
  ...pages.map(page => ({ ...page, kind: "page" as const, keywords: `${page.title} ${page.subtitle} ${pageAliases[page.id] ?? ""}` })),
];

export const popularGames = searchIndex.filter(item => item.kind === "game" && games.find(game => `game-${game.id}` === item.id)?.tag === "recommended").slice(0, 6);
export const shortcuts = ["page-topup", "page-cards", "page-wallet", "page-premium"].map(id => searchIndex.find(item => item.id === id)!);

const normalize = (value: string) => value.toLocaleLowerCase().normalize("NFKC").replace(/\s+/g, " ").trim();

// Rank: title starts with query > word in title starts with query > title contains > keywords contain every word.
export function searchItems(query: string): SearchItem[] {
  const q = normalize(query);
  if (!q) return [];
  const words = q.split(" ");
  return searchIndex
    .map(item => {
      const title = normalize(item.title);
      const haystack = normalize(`${item.title} ${item.keywords}`);
      if (!words.every(word => haystack.includes(word))) return null;
      const score = title.startsWith(q) ? 4 : title.split(" ").some(part => part.startsWith(q)) ? 3 : title.includes(q) ? 2 : 1;
      return { item, score };
    })
    .filter((entry): entry is { item: SearchItem; score: number } => entry !== null)
    .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title))
    .map(entry => entry.item);
}

export const groupOrder: SearchKind[] = ["game", "premium", "page"];
export const groupLabels: Record<SearchKind, string> = { game: "เกม", premium: "แอพพรีเมียม", page: "หน้าและบริการ" };

const RECENT_KEY = "thx2pay-recent-search";
export function readRecent(): SearchItem[] {
  try {
    const ids = JSON.parse(localStorage.getItem(RECENT_KEY) || "[]") as string[];
    return ids.map(id => searchIndex.find(item => item.id === id)).filter((item): item is SearchItem => !!item);
  } catch { return []; }
}
export function pushRecent(item: SearchItem) {
  try {
    const ids = [item.id, ...readRecent().map(entry => entry.id).filter(id => id !== item.id)].slice(0, 5);
    localStorage.setItem(RECENT_KEY, JSON.stringify(ids));
  } catch { /* storage blocked: recent list just stays empty */ }
}
export function clearRecent() {
  try { localStorage.removeItem(RECENT_KEY); } catch { /* nothing to clear */ }
}

export const OPEN_GAME_EVENT = "thx2pay-open-game";
