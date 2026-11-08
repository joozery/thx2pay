import { HomeIcon, DashboardIcon, IdCardIcon, StarIcon, PersonIcon, QuestionMarkCircledIcon, BackpackIcon, LightningBoltIcon, ReaderIcon, AvatarIcon, CubeIcon } from "@radix-ui/react-icons";
import type { NavTarget } from "./types";

export type NavLink = { label: string; target: NavTarget; href: string };

// Everything about topping up lives under one "เติมเงิน" menu (desktop dropdown and mobile tab bar).
export const topupLinks: (NavLink & { description: string })[] = [
  { label: "เติมเกม", target: "games", href: "/topup", description: "เติมเกมด้วย UID เข้าบัญชีทันที" },
  { label: "บัตรเติมเงิน", target: "cards", href: "/cards", description: "บัตรเติมเกม บัตรของขวัญ และโค้ดเกม" },
  { label: "เติมเงินเข้ากระเป๋า", target: "wallet", href: "/wallet/topup", description: "เติมยอดเงินไว้ใช้ซื้อสินค้าบนเว็บ" },
];
export const topupTargets = new Set<NavTarget>(topupLinks.map(link => link.target));
export const isTopupPath = (pathname: string) => topupLinks.some(link => pathname === link.href || pathname.startsWith(link.href + "/"));

export const homeLink: NavLink = { label: "หน้าแรก", target: "home", href: "/" };
export const premiumLink: NavLink = { label: "พรีเมียม", target: "premium", href: "/premium" };
export const accountsLink: NavLink = { label: "ไอดีเกม", target: "accounts", href: "/accounts" };
// Shown in the phone menu sheet; the desktop capsule is already full at tablet widths.
export const boxesLink: NavLink = { label: "กล่องสุ่ม", target: "boxes", href: "/boxes" };
export const promotionsLink: NavLink = { label: "โปรโมชั่น", target: "promotions", href: "/promotions" };
export const afterTopupLinks: NavLink[] = [
  accountsLink,
  premiumLink,
  promotionsLink,
  { label: "ข่าวสาร", target: "news", href: "/news" },
  { label: "ช่วยเหลือ", target: "help", href: "/help" },
];

export const navIcons: Record<NavTarget, typeof HomeIcon> = { home: HomeIcon, games: DashboardIcon, accounts: AvatarIcon, boxes: CubeIcon, cards: IdCardIcon, wallet: BackpackIcon, premium: LightningBoltIcon, promotions: StarIcon, news: ReaderIcon, help: QuestionMarkCircledIcon };
