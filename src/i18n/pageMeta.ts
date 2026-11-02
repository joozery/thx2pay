import type { Metadata } from "next";

// Page titles and descriptions, written in Thai (the source language). Each string is also a translation key,
// so the server renders Thai metadata and <DocumentMeta> swaps in the visitor's language on the client.
export const siteTitle = "THX2PAY | เติมเกมออนไลน์ รวดเร็ว ปลอดภัย";
export const siteDescription = "เติมเกมออนไลน์ บัตรเติมเงิน ไอดีเกม และไอเทม ครบทุกความสนุกกับ THX2PAY";
export const brandSuffix = " | THX2PAY";

type PageMeta = { name: string; description?: string };

export const pageMeta = {
  "/about": { name: "เกี่ยวกับเรา", description: "รู้จัก THX2PAY แพลตฟอร์มเติมเกมและสินค้าดิจิทัลที่ง่าย เร็ว และปลอดภัย" },
  "/account": { name: "บัญชีของฉัน" },
  "/cards": { name: "บัตรเติมเงิน", description: "บัตรเติมเงิน บัตรของขวัญ และโค้ดเกมจาก THX2PAY" },
  "/contact": { name: "ติดต่อเรา", description: "ช่องทางติดต่อทีมงาน THX2PAY" },
  "/forgot-password": { name: "ลืมรหัสผ่าน" },
  "/help": { name: "ช่วยเหลือ", description: "คำถามที่พบบ่อยและช่องทางติดต่อทีมงาน THX2PAY" },
  "/login": { name: "เข้าสู่ระบบ" },
  "/news": { name: "ข่าวสาร", description: "ข่าวสารและประกาศล่าสุดจาก THX2PAY" },
  "/partner": { name: "พาร์ทเนอร์", description: "ร่วมเป็นตัวแทนจำหน่ายและพาร์ทเนอร์กับ THX2PAY" },
  "/partner/apply": { name: "สมัครตัวแทนจำหน่าย" },
  "/premium": { name: "แอพพรีเมียม", description: "แอพพรีเมียมยอดนิยมสำหรับดูหนัง ฟังเพลง และทำงาน จาก THX2PAY" },
  "/privacy": { name: "นโยบายความเป็นส่วนตัว", description: "วิธีที่ THX2PAY เก็บ ใช้ และดูแลข้อมูลส่วนบุคคลของคุณ" },
  "/promotions": { name: "โปรโมชั่น", description: "ติดตามข่าวสารและสิทธิพิเศษจาก THX2PAY" },
  "/register": { name: "สมัครสมาชิก" },
  "/terms": { name: "ข้อกำหนดการใช้บริการ", description: "ข้อกำหนดและเงื่อนไขการใช้บริการ THX2PAY" },
  "/topup": { name: "เติมเกมออนไลน์", description: "เลือกเกมที่ต้องการเติม ค้นหา Free Fire, VALORANT และ PUBG MOBILE พร้อมข้อมูลและคำแนะนำจาก THX2PAY" },
  "/wallet/topup": { name: "กระเป๋าเงิน", description: "จัดการกระเป๋าเงิน เลือกช่องทางเติมเงิน และตรวจสอบประวัติรายการ THX2PAY" },
} satisfies Record<string, PageMeta>;

export type PageRoute = keyof typeof pageMeta;

/** Thai metadata for a route's `export const metadata`. */
export function pageMetadata(route: PageRoute): Metadata {
  const meta: PageMeta = pageMeta[route];
  return { title: meta.name + brandSuffix, ...(meta.description ? { description: meta.description } : {}) };
}

/** The closest matching page for a pathname (e.g. /account/orders → /account), or undefined for the home page. */
export function findPageMeta(pathname: string): PageMeta | undefined {
  for (let path = pathname.replace(/\/+$/, ""); path; path = path.slice(0, path.lastIndexOf("/"))) {
    if (Object.hasOwn(pageMeta, path)) return pageMeta[path as PageRoute];
  }
  return undefined;
}
