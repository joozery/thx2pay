import { games, type Game } from "@/components/topup/games";

// Sample game accounts for the demo storefront. Replace with the real stock list / API when selling goes live.
// Titles and stat labels are Thai translation keys; ranks, levels and brand names stay as written.
export type AccountTag = "hot" | "new";
export type AccountStat = { label: string; value: string };
export type GameAccount = {
  id: string;
  game: string;
  title: string;
  cover?: string;
  rank: string;
  level: string;
  stats: AccountStat[];
  login: string;
  region: string;
  price: number;
  was?: number;
  warrantyDays: number;
  tag?: AccountTag;
};

const stat = (label: string, value: string | number): AccountStat => ({ label, value: String(value) });

export const gameAccounts: GameAccount[] = [
  { id: "val-immortal-knives", game: "valorant", title: "ไอดี Immortal สกินมีด 3 เล่ม", cover: "/images/games/valorant-official.jpg", rank: "Immortal 2", level: "Lv. 214", stats: [stat("สกิน", 46), stat("เอเจนต์", "25/25"), stat("VP คงเหลือ", 320)], login: "Riot Account", region: "Asia Pacific", price: 4590, was: 5290, warrantyDays: 30, tag: "hot" },
  { id: "ff-evo-guns", game: "free-fire", title: "ไอดีปืนวิวัฒนาการ 6 กระบอก", cover: "/images/games/free-fire-official-hd.jpg", rank: "Grandmaster", level: "Lv. 76", stats: [stat("ปืนวิวัฒนาการ", 6), stat("สกินปืน", "120+"), stat("ตัวละคร", 38)], login: "Garena", region: "Thailand", price: 2490, was: 2790, warrantyDays: 30, tag: "hot" },
  { id: "genshin-ar60", game: "genshin-impact", title: "ไอดี AR 60 ตัวละคร 5 ดาว 14 ตัว", cover: "/images/promotions/genshin.jpg", rank: "AR 60", level: "World Level 9", stats: [stat("ตัวละคร 5 ดาว", 14), stat("อาวุธ 5 ดาว", 6), stat("เซิร์ฟเวอร์", "Asia")], login: "HoYoverse", region: "Asia", price: 3990, was: 4500, warrantyDays: 30, tag: "hot" },
  { id: "rov-conqueror", game: "rov", title: "ไอดี Conqueror ฮีโร่ครบทุกตัว", cover: "/images/promotions/rov.jpg", rank: "Conqueror", level: "Lv. 30", stats: [stat("ฮีโร่", 118), stat("สกิน", 210), stat("สกินหายาก", 12)], login: "Garena", region: "Thailand", price: 1890, was: 2190, warrantyDays: 30 },
  { id: "pubg-ace-mummy", game: "pubg-mobile", title: "ไอดีชุดหายาก + M416 อัปเกรดเต็ม", cover: "/images/games/pubg-mobile-official.jpg", rank: "Ace", level: "Lv. 72", stats: [stat("ชุด", "180+"), stat("สกินปืนอัปเกรด", 5), stat("ปีที่สร้าง", 2019)], login: "Facebook", region: "Asia", price: 3290, warrantyDays: 30, tag: "new" },
  { id: "mlbb-mythic-glory", game: "mobile-legends", title: "ไอดี Mythical Glory สกิน Collector", rank: "Mythical Glory", level: "Lv. 95", stats: [stat("ฮีโร่", 120), stat("สกิน", 260), stat("สกิน Collector", 4)], login: "Moonton", region: "Thailand", price: 2790, was: 3190, warrantyDays: 30 },
  { id: "val-starter", game: "valorant", title: "ไอดีเริ่มต้น ปลดเอเจนต์ครบ", cover: "/images/games/valorant-gameplay-official.jpg", rank: "Silver 3", level: "Lv. 88", stats: [stat("สกิน", 12), stat("เอเจนต์", "25/25"), stat("VP คงเหลือ", 0)], login: "Riot Account", region: "Asia Pacific", price: 890, warrantyDays: 15, tag: "new" },
  { id: "ff-elite-pass", game: "free-fire", title: "ไอดีชุดหายาก Elite Pass ครบ", cover: "/images/promotions/freefire.jpg", rank: "Heroic", level: "Lv. 62", stats: [stat("ชุด", 54), stat("Elite Pass", "S1–S30"), stat("ตัวละคร", 31)], login: "Garena", region: "Thailand", price: 1290, warrantyDays: 15 },
  { id: "hsr-tl70", game: "honkai-star-rail", title: "ไอดี TL 70 ตัวละคร 5 ดาว 10 ตัว", rank: "TL 70", level: "Equilibrium 6", stats: [stat("ตัวละคร 5 ดาว", 10), stat("Light Cone 5 ดาว", 5), stat("เซิร์ฟเวอร์", "Asia")], login: "HoYoverse", region: "Asia", price: 2590, warrantyDays: 30, tag: "new" },
  { id: "genshin-starter", game: "genshin-impact", title: "ไอดีรีโรล ตัวละคร 5 ดาว + อาวุธประจำตัว", cover: "/images/promotions/genshin.jpg", rank: "AR 12", level: "World Level 1", stats: [stat("ตัวละคร 5 ดาว", 1), stat("อาวุธ 5 ดาว", 1), stat("เซิร์ฟเวอร์", "Asia")], login: "HoYoverse", region: "Asia", price: 590, warrantyDays: 15 },
  { id: "codm-legendary", game: "call-of-duty-mobile", title: "ไอดี Legendary สกินมิธิก 3 ชิ้น", rank: "Legendary", level: "Lv. 150", stats: [stat("สกินมิธิก", 3), stat("สกินในตำนาน", 18), stat("ปีที่สร้าง", 2020)], login: "Activision", region: "Global", price: 2190, was: 2490, warrantyDays: 30 },
  { id: "roblox-limiteds", game: "roblox", title: "ไอดีเก่า พร้อมไอเทม Limited", rank: "—", level: "—", stats: [stat("ไอเทม Limited", 4), stat("ปีที่สร้าง", 2018), stat("Robux คงเหลือ", 450)], login: "Roblox", region: "Global", price: 1490, warrantyDays: 15 },
];

export const accountGame = (account: GameAccount): Game => games.find(game => game.id === account.game)!;
export const findAccount = (id: string) => gameAccounts.find(account => account.id === id);
/** Games that currently have accounts for sale, in catalog order. */
export const accountGames = games.filter(game => gameAccounts.some(account => account.game === game.id));
export const discountOf = (account: GameAccount) => account.was ? account.was - account.price : 0;
