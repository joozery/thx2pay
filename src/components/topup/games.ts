export type GamePlatform = "Mobile" | "PC Games" | "Console";
export type GameTag = "recommended" | "new";
export type Game = {
  id: string;
  name: string;
  publisher?: string;
  platforms: GamePlatform[];
  genre: string;
  icon: string;
  aliases: string;
  tag?: GameTag;
};

// These games are listed for inquiries; checkout and fulfillment are not connected.
export const games: Game[] = [
  { id: "free-fire", icon: "/images/games/icons/free-fire.png", name: "Free Fire", publisher: "Garena", platforms: ["Mobile"], genre: "Battle Royale", aliases: "ฟรีไฟร์ ฟีฟาย garena", tag: "recommended" },
  { id: "mobile-legends", icon: "/images/games/icons/mobile-legends.png", name: "Mobile Legends: Bang Bang", platforms: ["Mobile"], genre: "MOBA", aliases: "โมบายเลเจนด์ mlbb ml โมบา", tag: "recommended" },
  { id: "rov", icon: "/images/games/icons/rov.jpg", name: "Garena RoV", platforms: ["Mobile"], genre: "MOBA", aliases: "อาร์โอวี arena of valor garena", tag: "recommended" },
  { id: "pubg-mobile", icon: "/images/games/icons/pubg-mobile.png", name: "PUBG MOBILE", publisher: "KRAFTON / Tencent", platforms: ["Mobile"], genre: "Battle Royale", aliases: "พับจี ผับจี พับจีโมบาย pubg", tag: "recommended" },
  { id: "genshin-impact", icon: "/images/games/icons/genshin-impact.png", name: "Genshin Impact", platforms: ["Mobile", "PC Games", "Console"], genre: "RPG", aliases: "เกนชิน เก็นชิน genshin", tag: "recommended" },
  { id: "honkai-star-rail", icon: "/images/games/icons/honkai-star-rail.png", name: "Honkai: Star Rail", platforms: ["Mobile", "PC Games", "Console"], genre: "RPG", aliases: "ฮงไก สตาร์เรล honkai", tag: "new" },
  { id: "valorant", icon: "/images/games/icons/valorant.webp", name: "VALORANT", publisher: "Riot Games", platforms: ["PC Games"], genre: "Tactical FPS", aliases: "วาโลแรนต์ วาโล valorant riot", tag: "recommended" },
  { id: "call-of-duty-mobile", icon: "/images/games/icons/call-of-duty-mobile.png", name: "Call of Duty: Mobile", platforms: ["Mobile"], genre: "FPS", aliases: "คอลออฟดิวตี้ cod mobile", tag: "recommended" },
  { id: "fc-mobile", icon: "/images/games/icons/fc-mobile.png", name: "EA SPORTS FC Mobile", platforms: ["Mobile"], genre: "Sports", aliases: "เอฟซีโมบาย fifa football ฟุตบอล", tag: "new" },
  { id: "wild-rift", icon: "/images/games/icons/wild-rift.jpg", name: "League of Legends: Wild Rift", platforms: ["Mobile"], genre: "MOBA", aliases: "ไวลด์ริฟต์ lol ลีกออฟเลเจนด์", tag: "new" },
  { id: "zenless-zone-zero", icon: "/images/games/icons/zenless-zone-zero.png", name: "Zenless Zone Zero", platforms: ["Mobile", "PC Games", "Console"], genre: "RPG", aliases: "เซนเลส โซน ซีโร่ zzz", tag: "new" },
  { id: "wuthering-waves", icon: "/images/games/icons/wuthering-waves.png", name: "Wuthering Waves", platforms: ["Mobile", "PC Games", "Console"], genre: "RPG", aliases: "วูเธอริงเวฟ วูวะ wuwa", tag: "new" },
  { id: "arena-breakout", icon: "/images/games/icons/arena-breakout.png", name: "Arena Breakout", platforms: ["Mobile", "PC Games"], genre: "Tactical FPS", aliases: "อารีนาเบรกเอาต์ arena breakout", tag: "new" },
  { id: "roblox", icon: "/images/games/icons/roblox.png", name: "Roblox", platforms: ["Mobile", "PC Games", "Console"], genre: "Sandbox", aliases: "โรบล็อกซ์ โรบัค robux", tag: "recommended" },
  { id: "league-of-legends", icon: "/images/games/icons/league-of-legends.webp", name: "League of Legends", platforms: ["PC Games"], genre: "MOBA", aliases: "ลีกออฟเลเจนด์ lol riot" },
  { id: "fortnite", icon: "/images/games/icons/fortnite.png", name: "Fortnite", platforms: ["PC Games", "Console"], genre: "Battle Royale", aliases: "ฟอร์ทไนท์ fortnite v-bucks", tag: "new" },
];

export const genres = [...new Set(games.map(game => game.genre))].sort();
