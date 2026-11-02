// Official contact channels, shared by the help page, footer and floating social rail.
// Fill in `href` with the real account URL to activate a channel. Channels with `href: null`
// show as "เร็ว ๆ นี้" (coming soon) instead of linking to a guessed account.
export type ContactChannel = {
  id: "line" | "facebook" | "messenger" | "instagram" | "tiktok" | "youtube" | "email";
  name: string;
  handle: string;
  description: string;
  action: string;
  href: string | null;
  icon: string;      // full-colour logo in /public/icons/social (or an inline icon for email/messenger)
  color: string;     // brand colour used for the icon chip
  badge?: string;
};

export const contactChannels: ContactChannel[] = [
  { id: "line", name: "LINE Official", handle: "@thx2pay", description: "แชตกับทีมงานได้เร็วที่สุด ส่งรูปสลิปหรือ UID ได้เลย", action: "เพิ่มเพื่อน LINE", href: null, icon: "/icons/social/line.svg", color: "#06c755", badge: "ตอบเร็วที่สุด" },
  { id: "facebook", name: "Facebook", handle: "THX2PAY", description: "ติดตามโปรโมชั่นและข่าวสารล่าสุด", action: "ไปที่เพจ", href: null, icon: "/icons/social/facebook.svg", color: "#1877f2" },
  { id: "messenger", name: "Messenger", handle: "THX2PAY", description: "ทักแชตผ่าน Facebook Messenger", action: "ส่งข้อความ", href: null, icon: "messenger", color: "#0a7cff" },
  { id: "instagram", name: "Instagram", handle: "@thx2pay", description: "รูปและกิจกรรมใหม่ ๆ", action: "ติดตาม", href: null, icon: "/icons/social/instagram.svg", color: "#e4405f" },
  { id: "tiktok", name: "TikTok", handle: "@thx2pay", description: "คลิปสอนเติมเกมและรีวิว", action: "ติดตาม", href: null, icon: "/icons/social/tiktok.svg", color: "#111111" },
  { id: "youtube", name: "YouTube", handle: "THX2PAY", description: "วิดีโอแนะนำการใช้งาน", action: "ดูช่อง", href: null, icon: "/icons/social/youtube.svg", color: "#ff0000" },
  { id: "email", name: "อีเมล", handle: "support@thx2pay.com", description: "เหมาะกับเรื่องที่ต้องแนบรายละเอียด ตอบกลับภายใน 24 ชั่วโมง", action: "ส่งอีเมล", href: "mailto:support@thx2pay.com", icon: "email", color: "#25adf5" },
];

export const serviceHours = "ทุกวัน 09:00 – 24:00 น.";
export const channelById = (id: ContactChannel["id"]) => contactChannels.find(channel => channel.id === id)!;
