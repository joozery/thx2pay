export type PromoCategory = "เติมเกม" | "ไอดีเกม" | "แอปพรีเมียม" | "กล่องสุ่ม";

export type Promotion = {
  id: string;
  category: PromoCategory;
  title: string;
  desc: string;
  /** Short highlight shown on the image, e.g. "ลด 20%". */
  badge: string;
  /** `Artwork` key, or an absolute path under /public. */
  image: string;
  until: string;
  href: string;
  hot?: boolean;
};

export type Coupon = { code: string; title: string; text: string; until: string };

export const promoCategories: PromoCategory[] = ["เติมเกม", "ไอดีเกม", "แอปพรีเมียม", "กล่องสุ่ม"];

// Sample campaigns for the UI demo.
export const promotions: Promotion[] = [
  { id: "rov-20", category: "เติมเกม", title: "RoV เติมคูปองลด 20%", desc: "เติมครบ ฿500 ขึ้นไป ใช้โค้ด PK20 ลดทันที", badge: "ลด 20%", image: "/images/promotions/rov.jpg", until: "ถึง 31 ต.ค. 2569", href: "/topup", hot: true },
  { id: "ff-bonus", category: "เติมเกม", title: "Free Fire โบนัสเพชรเพิ่ม", desc: "เติมแพ็กเกจ 1060 เพชรขึ้นไป รับโบนัสเพิ่มพิเศษ", badge: "โบนัส +10%", image: "/images/promotions/freefire.jpg", until: "ถึง 7 พ.ย. 2569", href: "/topup", hot: true },
  { id: "genshin-first", category: "เติมเกม", title: "Genshin Impact เติมครั้งแรก x2", desc: "เติม Genesis Crystal ครั้งแรกของแต่ละแพ็กเกจ รับเพิ่มเท่าตัว", badge: "x2", image: "/images/promotions/genshin.jpg", until: "ถึง 15 พ.ย. 2569", href: "/topup" },
  { id: "pubg-uc", category: "เติมเกม", title: "PUBG Mobile UC ราคาพิเศษ", desc: "แพ็กเกจ 1800 UC ลดพิเศษสุดสัปดาห์นี้", badge: "ลด 10%", image: "/images/promotions/pubg.png", until: "ถึง 3 พ.ย. 2569", href: "/topup" },
  { id: "account-sale", category: "ไอดีเกม", title: "ไอดีเกมคุณภาพ ลดพิเศษ", desc: "ไอดี Valorant และ Free Fire ลดสูงสุด ฿300 รับประกันทุกไอดี", badge: "ลด ฿300", image: "/images/promotions/valorant.png", until: "ถึง 10 พ.ย. 2569", href: "/#categories" },
  { id: "netflix", category: "แอปพรีเมียม", title: "Netflix Premium แพ็ก 12 เดือน", desc: "สมัครรายปีคุ้มกว่า ประหยัดสูงสุด 17%", badge: "ประหยัด 17%", image: "/images/promotions/netflix.webp", until: "ถึง 30 พ.ย. 2569", href: "/#categories", hot: true },
  { id: "spotify", category: "แอปพรีเมียม", title: "Spotify Premium ฟังไม่มีโฆษณา", desc: "แพ็ก 3 เดือน ราคาพิเศษสำหรับสมาชิกใหม่", badge: "ลด 15%", image: "/images/promotions/spotify.webp", until: "ถึง 20 พ.ย. 2569", href: "/#categories" },
  { id: "box-gold", category: "กล่องสุ่ม", title: "กล่องทอง เพิ่มโอกาสแจ็กพอต", desc: "เปิดกล่องทองสัปดาห์นี้ โอกาสได้รางวัลใหญ่เพิ่มขึ้น", badge: "โอกาส +2%", image: "/images/promotions/mystery-box.png", until: "ถึง 5 พ.ย. 2569", href: "/#categories" },
];

export const coupons: Coupon[] = [
  { code: "PK20", title: "ลด 20% เมื่อเติมครบ ฿500", text: "สำหรับการเติมเกมทุกเกม", until: "ถึง 31 ต.ค. 2569" },
  { code: "NEW5", title: "สมาชิกใหม่ ลด 5%", text: "ใช้ได้กับคำสั่งซื้อแรก", until: "ไม่มีวันหมดอายุ" },
  { code: "PREMIUM10", title: "แอปพรีเมียม ลด ฿10", text: "เมื่อซื้อแอปพรีเมียมทุกแพ็กเกจ", until: "ถึง 30 พ.ย. 2569" },
];
