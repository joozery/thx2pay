"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ClockIcon, Cross2Icon, Pencil1Icon, ReaderIcon, BackpackIcon, PersonIcon, QuestionMarkCircledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { Avatar } from "./UserMenu";
import type { User } from "./AuthProvider";

export function AccountEmpty({ title, text, href, action }: { title: string; text: string; href?: string; action?: string }) {
  const { t } = useI18n();
  return <div className="member-empty"><span><ReaderIcon /></span><h3>{t(title)}</h3><p>{t(text)}</p>{href && action && <Link className="member-button" href={href}>{t(action)}<ArrowRightIcon /></Link>}</div>;
}

export function AccountStats({ sample = false }: { sample?: boolean }) {
  const { t } = useI18n();
  return <ul className="member-stats">{[
    { label: "คำสั่งซื้อทั้งหมด", Icon: ReaderIcon, tone: "blue", count: sample ? recentExamples.length : 0 },
    { label: "สำเร็จแล้ว", Icon: CheckIcon, tone: "green", count: sample ? recentExamples.filter(order => order.tone === "complete").length : 0 },
    { label: "กำลังดำเนินการ", Icon: ClockIcon, tone: "amber", count: sample ? recentExamples.filter(order => order.tone === "pending").length : 0 },
    { label: "ยกเลิก", Icon: Cross2Icon, tone: "rose", count: sample ? recentExamples.filter(order => order.tone === "cancelled").length : 0 },
  ].map(({ label, Icon, tone, count }) => <li key={label}><span className={`member-icon ${tone}`}><Icon /></span><div><p>{t(label)}</p><b>{count} <small>{t("รายการ")}</small></b></div><ArrowRightIcon /></li>)}</ul>;
}


const recentExamples = [
  { id: "DEMO-1004", game: "Garena RoV", item: "คูปอง 325 คูปอง", image: "/images/games/icons/rov.jpg", amount: 300, date: "02/11/2026 · 14:32", status: "สำเร็จแล้ว", tone: "complete" },
  { id: "DEMO-1003", game: "Free Fire", item: "เพชร 310 เพชร", image: "/images/games/icons/free-fire.png", amount: 100, date: "02/11/2026 · 12:15", status: "กำลังดำเนินการ", tone: "pending" },
  { id: "DEMO-1002", game: "Genshin Impact", item: "Genesis Crystals 300 + 30", image: "/images/games/icons/genshin-impact.png", amount: 179, date: "01/11/2026 · 19:40", status: "สำเร็จแล้ว", tone: "complete" },
  { id: "DEMO-1001", game: "PUBG MOBILE", item: "UC 325 UC", image: "/images/games/icons/pubg-mobile.png", amount: 150, date: "01/11/2026 · 10:08", status: "ยกเลิก", tone: "cancelled" },
];

function RecentOrderExamples() {
  const { t, language } = useI18n();
  return <><p className="member-recent-note">{t("รายการด้านล่างเป็นตัวอย่าง ไม่ใช่ธุรกรรมจริง")}</p><ul className="member-recent-list">{recentExamples.map(order => <li key={order.id}>
    <div className="member-recent-art"><Image src={order.image} alt="" fill sizes="48px" /></div>
    <div className="member-recent-info"><h3>{order.game}</h3><p>{t(order.item)}</p><small>{order.id} · {order.date}</small></div>
    <div className="member-recent-result"><strong>฿{order.amount.toLocaleString(language === "th" ? "th-TH" : "en-US", { minimumFractionDigits: 2 })}</strong><span className={`member-recent-status ${order.tone}`}>{order.tone === "complete" ? <CheckIcon /> : order.tone === "pending" ? <ClockIcon /> : <Cross2Icon />}{t(order.status)}</span></div>
  </li>)}</ul></>;
}

export default function AccountDashboard({ user }: { user: User }) {
  const { t, language } = useI18n();
  const spending = recentExamples.filter(order => order.tone === "complete").reduce((total, order) => total + order.amount, 0);
  return <>
    <section className="member-profile-hero" aria-label={t("ข้อมูลสมาชิก")}>
      <div className="member-profile-identity"><div className="member-profile-main"><Avatar name={user.name} size={88} /><div><span className="member-badge"><PersonIcon />{t("สมาชิก THX2PAY")}</span><h2>{user.name}</h2><p>{user.email}</p></div><Link className="member-edit-link" href="/account/edit"><Pencil1Icon />{t("แก้ไขโปรไฟล์")}</Link></div><div className="member-profile-meta"><span><CheckIcon />{t("พร้อมดูแลทุกการเติมเกม")}</span><span>{t("บัญชีตัวอย่าง")}</span></div></div>
      <Image className="member-hero-mascot" src="/images/banners/partner-v1.webp" alt="" fill sizes="400px" />
      <div className="member-level"><span>{t("ข้อมูลบัญชี")}</span><h3>{t("สมาชิกทั่วไป")}</h3><dl><div><dt>{t("ยอดใช้จ่ายสะสม (ตัวอย่าง)")}</dt><dd>฿{spending.toLocaleString(language === "th" ? "th-TH" : "en-US", { minimumFractionDigits: 2 })}</dd></div></dl><Link href="/account/settings">{t("จัดการบัญชี")}<ArrowRightIcon /></Link></div>
    </section>
    <p className="member-profile-sample-note">{t("ยอดเงินและสถิติด้านล่างเป็นข้อมูลตัวอย่างสำหรับแสดงหน้าบัญชี")}</p>
    <AccountStats sample />
    <div className="member-dashboard-grid">
      <div className="member-main-column"><Link className="member-promo" href="/promotions"><Image src="/images/banners/offers-v1.webp" alt="" fill sizes="(max-width: 900px) 90vw, 60vw" /><div><span>THX2PAY SPECIAL OFFERS</span><h2>{t("เติมความสนุกให้เกมโปรด")}</h2><p>{t("รวมโปรโมชั่นและสิทธิพิเศษไว้ที่เดียว")}</p><span className="member-button">{t("ดูโปรโมชั่น")}<ArrowRightIcon /></span></div></Link>
        <section className="member-card"><div className="member-card-head"><span className="member-icon blue"><ReaderIcon /></span><div><h2>{t("รายการล่าสุด")}</h2><p>{t("ติดตามรายการเติมเกมของคุณ")}</p></div><Link href="/account/history">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div><RecentOrderExamples /></section>
      </div>
      <div className="member-side-column"><section className="member-card member-wallet"><div className="member-card-head"><span className="member-icon blue"><BackpackIcon /></span><h2>{t("กระเป๋าเงินของฉัน")}</h2></div><p>{t("ยอดเงินคงเหลือ (ตัวอย่าง)")}</p><div className="member-wallet-balance"><b>฿1,250<span>.00</span></b><Link className="member-button" href="/wallet/topup">+ {t("เติมเงิน")}</Link></div><div className="member-wallet-shortcuts">{[{ href: "/wallet/topup", label: "เติมเงิน", Icon: BackpackIcon }, { href: "/account/history", label: "ประวัติ", Icon: ClockIcon }, { href: "/account/uids", label: "UID", Icon: ReaderIcon }, { href: "/account/settings", label: "ตั้งค่า", Icon: PersonIcon }].map(({href,label,Icon}) => <Link key={href} href={href}><span><Icon /></span>{t(label)}</Link>)}</div></section>
        <section className="member-card member-benefits"><span className="member-badge">THX2PAY PARTNER</span><h2>{t("เติมมากกว่า คุ้มกว่า")}</h2><p>{t("สมัครตัวแทน รับส่วนลดพิเศษ")}</p><Link href="/partner">{t("ดูสิทธิพิเศษ")}<ArrowRightIcon /></Link></section>
        <section className="member-card"><div className="member-card-head"><span className="member-icon rose"><QuestionMarkCircledIcon /></span><div><h2>{t("ช่องทางติดต่อ")}</h2><p>{t("หากมีคำถามหรือพบปัญหา")}</p></div></div><div className="member-contact-links"><Link href="/help">{t("ศูนย์ช่วยเหลือ")}</Link><a href="mailto:support@thx2pay.com">{t("ติดต่อเรา")}</a></div></section>
      </div>
    </div>
  </>;
}
