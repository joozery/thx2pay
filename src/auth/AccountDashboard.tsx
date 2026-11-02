"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, CheckIcon, ClockIcon, Cross2Icon, Pencil1Icon, ReaderIcon, BackpackIcon, DashboardIcon, IdCardIcon, PlusIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { games } from "@/components/topup/games";
import { Avatar } from "./UserMenu";
import type { User } from "./AuthProvider";
import { sampleOrders, statusLabels, useSavedUIDs, type Order } from "./accountData";

export function AccountEmpty({ title, text, href, action, level = 3 }: { title: string; text: string; href?: string; action?: string; level?: 2 | 3 }) {
  const { t } = useI18n();
  const Heading = level === 2 ? "h2" : "h3";
  return <div className="member-empty"><span><ReaderIcon /></span><Heading>{t(title)}</Heading><p>{t(text)}</p>{href && action && <Link className="member-button" href={href}>{t(action)}<ArrowRightIcon /></Link>}</div>;
}

export function OrderList({ orders }: { orders: Order[] }) {
  const { t, locale } = useI18n();
  return <ul className="member-recent-list">{orders.map(order => <li key={order.id}>
    <div className="member-recent-art"><Image src={order.image} alt="" fill sizes="48px" /></div>
    <div className="member-recent-info"><h3>{order.game}</h3><p>{t(order.item)}</p><small>{order.id} · {order.date}</small></div>
    <div className="member-recent-result"><strong>฿{order.amount.toLocaleString(locale, { minimumFractionDigits: 2 })}</strong><span className={`member-recent-status ${order.status}`}>{order.status === "complete" ? <CheckIcon /> : order.status === "pending" ? <ClockIcon /> : <Cross2Icon />}{t(statusLabels[order.status])}</span></div>
  </li>)}</ul>;
}

const quickActions = [
  { href: "/topup", label: "เติมเกม", Icon: DashboardIcon },
  { href: "/wallet/topup", label: "เติมเงิน", Icon: BackpackIcon },
  { href: "/cards", label: "บัตรเติมเงิน", Icon: IdCardIcon },
  { href: "/account/orders", label: "คำสั่งซื้อ", Icon: ReaderIcon },
];

// Overview: the few things customers check most, in priority order.
export default function AccountDashboard({ user }: { user: User }) {
  const { t } = useI18n();
  const { items: uids } = useSavedUIDs(user.email);
  return <>
    <div className="ov-head">
      <Avatar name={user.name} size={64} />
      <div className="ov-head-text"><span className="ov-kicker">MY THX2PAY</span><h1>{t("สวัสดี")}, {user.name}</h1><p>{user.email}</p></div>
      <Link className="ov-edit" href="/account/settings#profile"><Pencil1Icon />{t("แก้ไขโปรไฟล์")}</Link>
    </div>

    <div className="ov-top">
      <section className="ov-wallet" aria-labelledby="ov-wallet-title">
        <div className="ov-wallet-row"><span className="ov-wallet-icon"><BackpackIcon /></span><h2 id="ov-wallet-title">{t("ยอดเงินคงเหลือ")}</h2></div>
        <b className="ov-balance">฿0<span>.00</span></b>
        <div className="ov-wallet-actions"><Link className="member-button" href="/wallet/topup"><PlusIcon />{t("เติมเงิน")}</Link><Link className="ov-ghost" href="/wallet/topup#wallet-transactions">{t("ดูรายการ")}</Link></div>
      </section>
      <nav className="ov-actions" aria-label={t("ทางลัด")}>
        {quickActions.map(({ href, label, Icon }) => <Link key={href} href={href}><span><Icon /></span>{t(label)}</Link>)}
      </nav>
    </div>

    <div className="ov-grid">
      <section className="member-card" aria-labelledby="ov-orders-title">
        <div className="ov-card-head"><h2 id="ov-orders-title">{t("คำสั่งซื้อล่าสุด")}</h2><Link href="/account/orders">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div>
        <p className="member-recent-note">{t("รายการด้านล่างเป็นตัวอย่าง ไม่ใช่ธุรกรรมจริง")}</p>
        <OrderList orders={sampleOrders.slice(0, 3)} />
      </section>
      <section className="member-card" aria-labelledby="ov-uids-title">
        <div className="ov-card-head"><h2 id="ov-uids-title">{t("UID ของฉัน")}</h2><Link href="/account/uids">{t("จัดการ")}<ArrowRightIcon /></Link></div>
        {uids.length ? <ul className="ov-uids">{uids.slice(0, 4).map(item => { const game = games.find(entry => entry.id === item.game); return <li key={item.id}>{game && <Image src={game.icon} alt="" width={36} height={36} />}<div><strong>{game?.name ?? item.game}</strong><span>{item.uid}</span></div><Link href={`/topup?game=${item.game}`} className="ov-uid-go">{t("เติม")}</Link></li>; })}</ul>
          : <div className="ov-uid-empty"><p>{t("บันทึก UID ไว้ ครั้งหน้าไม่ต้องพิมพ์ใหม่")}</p><Link className="member-button" href="/account/uids"><PlusIcon />{t("เพิ่ม UID")}</Link></div>}
      </section>
    </div>
  </>;
}
