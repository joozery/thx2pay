import { findGameProduct } from "@/components/checkout/catalog";
import { gameAccounts } from "@/components/accounts/accounts";
import { games, type Game } from "@/components/topup/games";

// Sample mystery boxes for the demo. Prizes are the game's own top-up packs (sent to the player's UID),
// and the jackpot is a game account from /accounts when one is listed. Replace with the real prize table / API.
export type Rarity = "common" | "uncommon" | "rare" | "epic" | "legendary";
export type BoxPrize = { id: string; name: string; rarity: Rarity; chance: number; value: number; accountId?: string };
export type MysteryBox = { id: string; game: string; name: string; price: number; prizes: BoxPrize[]; tag?: "hot" | "new" };

export const rarities: Rarity[] = ["common", "uncommon", "rare", "epic", "legendary"];
export const rarityLabels: Record<Rarity, string> = { common: "ธรรมดา", uncommon: "พิเศษ", rare: "หายาก", epic: "มหากาพย์", legendary: "ตำนาน" };
// Drop rates in percent per rarity tier; each box has one prize per tier, so these add up to 100.
const chances: Record<Rarity, number> = { common: 52, uncommon: 28, rare: 13, epic: 6, legendary: 1 };

type BoxConfig = { id: string; game: string; name: string; price: number; packs: [number, number, number, number]; tag?: MysteryBox["tag"] };

// `packs` are indexes into the game's checkout packages for the common → epic tiers.
const configs: BoxConfig[] = [
  { id: "free-fire-box", game: "free-fire", name: "กล่องเพชร Free Fire", price: 49, packs: [0, 1, 2, 3], tag: "hot" },
  { id: "valorant-box", game: "valorant", name: "กล่อง VP VALORANT", price: 149, packs: [0, 1, 2, 3], tag: "hot" },
  { id: "genshin-box", game: "genshin-impact", name: "กล่องคริสตัล Genshin", price: 99, packs: [0, 1, 2, 3] },
  { id: "rov-box", game: "rov", name: "กล่องคูปอง RoV", price: 39, packs: [0, 1, 2, 3], tag: "new" },
  { id: "pubg-box", game: "pubg-mobile", name: "กล่อง UC PUBG MOBILE", price: 49, packs: [0, 1, 2, 3] },
  { id: "mlbb-box", game: "mobile-legends", name: "กล่องเพชร MLBB", price: 59, packs: [0, 1, 2, 3], tag: "new" },
];

function build(config: BoxConfig): MysteryBox {
  const product = findGameProduct(config.game)!;
  const tiers = rarities.slice(0, 4);
  const prizes: BoxPrize[] = config.packs.map((index, tier) => {
    const pack = product.packages[index];
    return { id: `${config.id}-${pack.id}`, name: pack.label, rarity: tiers[tier], chance: chances[tiers[tier]], value: pack.price };
  });
  // Jackpot: the most valuable listed account for this game, otherwise the biggest top-up pack.
  const account = gameAccounts.filter(item => item.game === config.game).sort((a, b) => b.price - a.price)[0];
  const top = product.packages[product.packages.length - 1];
  prizes.push(account
    ? { id: `${config.id}-account`, name: account.title, rarity: "legendary", chance: chances.legendary, value: account.price, accountId: account.id }
    : { id: `${config.id}-${top.id}`, name: top.label, rarity: "legendary", chance: chances.legendary, value: top.price });
  return { id: config.id, game: config.game, name: config.name, price: config.price, prizes, tag: config.tag };
}

export const mysteryBoxes = configs.map(build);
export const findBox = (id: string) => mysteryBoxes.find(box => box.id === id);
export const boxGame = (box: MysteryBox): Game => games.find(game => game.id === box.game)!;
export const jackpotOf = (box: MysteryBox) => box.prizes[box.prizes.length - 1];

/** Draws one prize using the published drop rates. */
export function drawPrize(box: MysteryBox, random = Math.random()): BoxPrize {
  const total = box.prizes.reduce((sum, prize) => sum + prize.chance, 0);
  let roll = random * total;
  for (const prize of box.prizes) {
    roll -= prize.chance;
    if (roll < 0) return prize;
  }
  return box.prizes[0];
}
