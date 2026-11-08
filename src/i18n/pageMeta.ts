import { findNewsArticle } from "@/components/news/data";
import type { Metadata } from "next";
import { games } from "@/components/topup/games";
import { premiumApps } from "@/components/home/premiumApps";
import { findAccount, accountGame } from "@/components/accounts/accounts";
import { boxGame, findBox } from "@/components/boxes/boxes";

// Page titles and descriptions, written in Thai (the source language). Each string is also a translation key,
// so the server renders Thai metadata and <DocumentMeta> swaps in the visitor's language on the client.
export const siteTitle = "THX2PAY | เติมเกมออนไลน์ รวดเร็ว ปลอดภัย";
export const siteDescription = "เติมเกมออนไลน์ บัตรเติมเงิน ไอดีเกม และไอเทม ครบทุกความสนุกกับ THX2PAY";
export const brandSuffix = " | THX2PAY";

type PageMeta = { name: string; description?: string; values?: Record<string, string> };

export const pageMeta = {
  "/about": { name: "เกี่ยวกับเรา", description: "รู้จัก THX2PAY แพลตฟอร์มเติมเกมและสินค้าดิจิทัลที่ง่าย เร็ว และปลอดภัย" },
  "/account": { name: "บัญชีของฉัน" },
  "/accounts": { name: "ไอดีเกม", description: "ซื้อไอดีเกมคุณภาพ ผ่านการตรวจสอบ พร้อมรับประกันทุกไอดีจาก THX2PAY" },
  "/boxes": { name: "กล่องสุ่ม", description: "เปิดกล่องสุ่มเกม ลุ้นไอเทมและไอดีเกม พร้อมแสดงอัตราออกรางวัลทุกกล่องจาก THX2PAY" },
  "/cards": { name: "บัตรเติมเงิน", description: "บัตรเติมเงิน บัตรของขวัญ และโค้ดเกมจาก THX2PAY" },
  "/contact": { name: "ติดต่อเรา", description: "ช่องทางติดต่อทีมงาน THX2PAY" },
  "/forgot-password": { name: "ลืมรหัสผ่าน" },
  "/help": { name: "ช่วยเหลือ", description: "คำถามที่พบบ่อยและช่องทางติดต่อทีมงาน THX2PAY" },
  "/login": { name: "เข้าสู่ระบบ" },
  "/news": { name: "ข่าวสาร", description: "ข่าวสารและประกาศล่าสุดจาก THX2PAY" },
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

// Product pages (/topup/<game>, /premium/<app>, /accounts/<id>, /boxes/<id>): name and description are keys with a {{name}} value.
function findProductMeta(pathname: string): PageMeta | undefined {
  const [, section, id] = pathname.replace(/\/+$/, "").split("/");
  const article = section === "news" && id ? findNewsArticle(id) : undefined;
  if (article) return { name: article.title, description: article.excerpt };
  const game = section === "topup" ? games.find(item => item.id === id) : undefined;
  if (game) return { name: "เติม {{name}}", description: "เลือกแพ็กเกจ {{name}} กรอก UID และชำระเงินได้ในไม่กี่ขั้นตอนกับ THX2PAY", values: { name: game.name } };
  const app = section === "premium" ? premiumApps.find(item => item.id === id) : undefined;
  if (app) return { name: "ซื้อ {{name}}", description: "เลือกแพ็กเกจ {{name}} และรับรหัสทางอีเมลกับ THX2PAY", values: { name: app.name } };
  const card = section === "cards" ? games.find(item => item.id === id) : undefined;
  if (card) return { name: "บัตร {{name}}", description: "เลือกบัตรเติมเกมจากเกมที่คุณชอบ", values: { name: card.name } };
  const account = section === "accounts" && id ? findAccount(id) : undefined;
  if (account) return { name: "ไอดี {{name}}", description: "ไอดี {{name}} ผ่านการตรวจสอบ รับประกันทุกไอดี ส่งข้อมูลทางอีเมลกับ THX2PAY", values: { name: accountGame(account).name } };
  const box = section === "boxes" && id ? findBox(id) : undefined;
  if (box) return { name: box.name, description: "เปิดกล่องสุ่ม {{name}} ลุ้นรางวัล พร้อมดูอัตราออกรางวัลกับ THX2PAY", values: { name: boxGame(box).name } };
  return undefined;
}

/** Thai title and description for a checkout route, or undefined when the product does not exist. */
export function productPageMeta(pathname: string) {
  const meta = findProductMeta(pathname);
  if (!meta) return undefined;
  const fill = (text: string) => text.replaceAll("{{name}}", meta.values?.name ?? "");
  return { title: fill(meta.name) + brandSuffix, description: fill(meta.description ?? "") };
}

/** The closest matching page for a pathname (e.g. /account/orders → /account), or undefined for the home page. */
export function findPageMeta(pathname: string): PageMeta | undefined {
  const product = findProductMeta(pathname);
  if (product) return product;
  for (let path = pathname.replace(/\/+$/, ""); path; path = path.slice(0, path.lastIndexOf("/"))) {
    if (Object.hasOwn(pageMeta, path)) return pageMeta[path as PageRoute];
  }
  return undefined;
}
