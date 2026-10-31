// Placeholder list: edit names, categories and colours to match what THX2PAY actually sells.
// Logos live in public/images/premium (see SOURCES.md there).
export type PremiumApp = { id: string; name: string; category: string; logo: string; color: string };

export const premiumApps: PremiumApp[] = [
  { id: "netflix", name: "Netflix", category: "สตรีมมิงวิดีโอ", logo: "/images/premium/netflix.svg", color: "#141414" },
  { id: "youtube-premium", name: "YouTube Premium", category: "วิดีโอ · เพลง", logo: "/images/premium/youtube.svg", color: "#d92d20" },
  { id: "spotify", name: "Spotify", category: "สตรีมมิงเพลง", logo: "/images/premium/spotify.svg", color: "#1db954" },
  { id: "crunchyroll", name: "Crunchyroll", category: "สตรีมมิงอนิเมะ", logo: "/images/premium/crunchyroll.svg", color: "#f47521" },
  { id: "canva-pro", name: "Canva Pro", category: "ออกแบบ", logo: "/images/premium/canva.svg", color: "#7d2ae8" },
  { id: "chatgpt-plus", name: "ChatGPT Plus", category: "AI ผู้ช่วย", logo: "/images/premium/openai.svg", color: "#10a37f" },
];
