import { games, type Game } from "@/components/topup/games";
import { premiumApps, type PremiumApp } from "@/components/home/premiumApps";

// Sample packages and prices for the demo checkout. Replace with the real price list / API when fulfillment is connected.
export type CheckoutPackage = { id: string; label: string; amount?: number; bonus?: number; months?: number; price: number; popular?: boolean };

/** How the buyer identifies the account that receives the item. */
export type AccountField =
  | { kind: "uid"; label: string; placeholder: string; zone?: boolean; servers?: string[] }
  | { kind: "email"; label: string; placeholder: string };

export type CheckoutProduct = {
  kind: "game" | "app" | "card";
  id: string;
  name: string;
  subtitle: string;
  image: string;
  color?: string;
  unit?: string;
  account: AccountField;
  packages: CheckoutPackage[];
};

type Pack = [amount: number, price: number, bonus?: number];
type GameConfig = { unit: string; packs: Pack[]; account?: Partial<Extract<AccountField, { kind: "uid" }>> };

const hoyoServers = ["Asia", "America", "Europe", "TW, HK, MO"];
const uid = (label = "UID / Player ID", placeholder = "เช่น 123456789") => ({ label, placeholder });

const gameConfig: Record<string, GameConfig> = {
  "free-fire": { unit: "Diamonds", packs: [[100, 35], [310, 99], [520, 159], [1060, 319], [2180, 639], [5600, 1590]] },
  "mobile-legends": { unit: "Diamonds", packs: [[86, 59], [172, 115], [257, 169], [706, 449], [2195, 1349], [3688, 2249]], account: { zone: true } },
  "rov": { unit: "Vouchers", packs: [[30, 29], [115, 99], [230, 199], [370, 299], [800, 599], [2000, 1499]], account: { placeholder: "เช่น 1234567890123456" } },
  "pubg-mobile": { unit: "UC", packs: [[60, 35], [325, 175], [660, 345], [1800, 875], [3850, 1750], [8100, 3500]] },
  "genshin-impact": { unit: "Genesis Crystals", packs: [[60, 35], [300, 179, 30], [980, 549, 110], [1980, 1100, 260], [3280, 1790, 600], [6480, 3590, 1600]], account: { servers: hoyoServers } },
  "honkai-star-rail": { unit: "Oneiric Shards", packs: [[60, 35], [300, 179, 30], [980, 549, 110], [1980, 1100, 260], [3280, 1790, 600], [6480, 3590, 1600]], account: { servers: hoyoServers } },
  "valorant": { unit: "VP", packs: [[475, 150], [1000, 300], [2050, 600], [3650, 1050], [5350, 1500], [11000, 3000]], account: uid("Riot ID", "เช่น PlayerName#TH1") },
  "call-of-duty-mobile": { unit: "CP", packs: [[80, 35], [420, 175], [880, 349], [2400, 875], [5000, 1750], [10800, 3500]] },
  "fc-mobile": { unit: "FC Points", packs: [[40, 35], [100, 79], [520, 379], [1070, 749], [2200, 1490], [5750, 3790]] },
  "wild-rift": { unit: "Wild Cores", packs: [[425, 149], [1000, 349], [1850, 629], [3275, 1090], [4800, 1590], [10000, 3290]], account: uid("Riot ID", "เช่น PlayerName#TH1") },
  "zenless-zone-zero": { unit: "Monochrome", packs: [[60, 35], [300, 179, 30], [980, 549, 110], [1980, 1100, 260], [3280, 1790, 600], [6480, 3590, 1600]], account: { servers: hoyoServers } },
  "wuthering-waves": { unit: "Lunite", packs: [[60, 35], [300, 179, 30], [980, 549, 110], [1980, 1100, 260], [3280, 1790, 600], [6480, 3590, 1600]], account: { servers: hoyoServers } },
  "arena-breakout": { unit: "Bonds", packs: [[60, 35], [310, 175], [630, 349], [1580, 875], [3200, 1750], [6500, 3500]] },
  "roblox": { unit: "Robux", packs: [[80, 35], [400, 159], [800, 319], [1700, 639], [4500, 1590], [10000, 3190]], account: uid("Username", "เช่น roblox_player") },
  "league-of-legends": { unit: "RP", packs: [[575, 150], [1380, 350], [2800, 700], [4500, 1100], [6500, 1590], [13500, 3290]], account: uid("Riot ID", "เช่น PlayerName#TH1") },
  "fortnite": { unit: "V-Bucks", packs: [[1000, 319], [2800, 799], [5000, 1290], [13500, 3190]], account: uid("Epic Games ID", "เช่น epic_player") },
};

type Plan = [label: string, months: number, price: number];
const appPlans: Record<string, Plan[]> = {
  "netflix": [["Mobile", 1, 99], ["Basic", 1, 169], ["Standard", 1, 349], ["Premium 4K", 1, 419], ["Premium 4K", 3, 1199]],
  "youtube-premium": [["Individual", 1, 159], ["Individual", 3, 459], ["Individual", 12, 1690], ["Family", 1, 299]],
  "spotify": [["Individual", 1, 139], ["Individual", 3, 399], ["Duo", 1, 179], ["Family", 1, 219]],
  "crunchyroll": [["Fan", 1, 119], ["Mega Fan", 1, 159], ["Mega Fan", 12, 1590]],
  "canva-pro": [["Pro", 1, 349], ["Pro", 12, 2990], ["Teams", 1, 599]],
  "chatgpt-plus": [["Plus", 1, 749], ["Plus", 3, 2190]],
  "prime-video": [["Monthly", 1, 149], ["Monthly", 3, 429], ["Annual", 12, 1490]],
  "apple-music": [["Individual", 1, 109], ["Family", 1, 169], ["Individual", 12, 1090]],
};

// Mark the middle package as the popular pick so every catalog gets a sensible default.
const withPopular = (packages: CheckoutPackage[]) => packages.map((item, index) => ({ ...item, popular: index === Math.min(2, packages.length - 1) }));

function fromGame(game: Game): CheckoutProduct {
  const config = gameConfig[game.id] ?? { unit: "Credits", packs: [[100, 35], [500, 169], [1000, 329]] };
  return {
    kind: "game", id: game.id, name: game.name, subtitle: `${game.genre} · ${game.platforms.join(", ")}`, image: game.icon, unit: config.unit,
    account: { kind: "uid", ...uid(), ...config.account },
    packages: withPopular(config.packs.map(([amount, price, bonus]) => ({ id: `${amount}`, label: `${amount.toLocaleString("en-US")} ${config.unit}`, amount, bonus, price }))),
  };
}

function fromApp(app: PremiumApp): CheckoutProduct {
  const plans = appPlans[app.id] ?? [["Premium", 1, 199]];
  return {
    kind: "app", id: app.id, name: app.name, subtitle: app.category, image: app.logo, color: app.color,
    account: { kind: "email", label: "อีเมลสำหรับรับรหัส / เปิดใช้งาน", placeholder: "you@example.com" },
    packages: withPopular(plans.map(([label, months, price]) => ({ id: `${label}-${months}`.toLowerCase().replace(/\s+/g, "-"), label, months, price }))),
  };
}

// Game gift cards: fixed face values, the code is sent by email. Sample prices until the real card catalog is connected.
const cardValues = [100, 300, 500, 1000];
function fromCard(game: Game): CheckoutProduct {
  return {
    kind: "card", id: game.id, name: game.name, subtitle: `${game.genre} · ${game.platforms.join(", ")}`, image: game.icon,
    account: { kind: "email", label: "อีเมลสำหรับรับรหัส / เปิดใช้งาน", placeholder: "you@example.com" },
    packages: cardValues.map(value => ({ id: `${value}`, label: `฿${value.toLocaleString("en-US")}`, price: value, popular: value === 300 })),
  };
}

export const gameProducts = games.map(fromGame);
export const cardProducts = games.map(fromCard);
export const findCardProduct = (id: string) => cardProducts.find(product => product.id === id);
export const appProducts = premiumApps.map(fromApp);
export const findGameProduct = (id: string) => gameProducts.find(product => product.id === id);
export const findAppProduct = (id: string) => appProducts.find(product => product.id === id);
