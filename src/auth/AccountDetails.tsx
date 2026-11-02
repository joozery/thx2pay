"use client";

import { useEffect, useState, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { BellIcon, CheckIcon, MagnifyingGlassIcon, ReaderIcon, TrashIcon } from "@radix-ui/react-icons";
import GameSelect from "./GameSelect";
import PasswordChangeCard from "./PasswordChangeCard";
import { Avatar } from "./UserMenu";
import { AccountEmpty, OrderList } from "./AccountDashboard";
import AccountIcon from "./AccountIcon";
import { useI18n } from "@/i18n/useI18n";
import ThemeToggle from "@/components/home/ThemeToggle";
import LanguageSwitcher from "@/components/home/LanguageSwitcher";
import { useAuth, type User } from "./AuthProvider";
import { accountSections, settingsSections, type AccountSection } from "./accountMenu";
import { sampleOrders, statusLabels, usePreferences, useSavedUIDs, type OrderStatus } from "./accountData";
import { games } from "@/components/topup/games";
import { useNotifications } from "./notifications";
import NotificationList from "./NotificationList";
import "./notifications.css";

function PageTitle({ title, text }: { title: string; text: string }) {
  const { t } = useI18n();
  return <div className="acct-page-head"><h1>{t(title)}</h1><p>{t(text)}</p></div>;
}

export default function AccountDetails({ section, user }: { section: AccountSection; user: User }) {
  if (section === "orders") return <Orders />;
  if (section === "uids") return <SavedUIDs email={user.email} />;
  if (section === "notifications") return <Inbox email={user.email} />;
  return <Settings user={user} />;
}

/* ---------- คำสั่งซื้อ ---------- */
const filters: ("all" | OrderStatus)[] = ["all", "complete", "pending", "cancelled"];
function Orders() {
  const { t } = useI18n();
  const [status, setStatus] = useState<"all" | OrderStatus>("all");
  const [query, setQuery] = useState("");
  const q = query.trim().toLocaleLowerCase();
  const visible = sampleOrders.filter(order => (status === "all" || order.status === status) && (!q || `${order.game} ${order.item} ${order.id}`.toLocaleLowerCase().includes(q)));
  const count = (value: "all" | OrderStatus) => value === "all" ? sampleOrders.length : sampleOrders.filter(order => order.status === value).length;
  return <>
    <PageTitle title={accountSections.orders} text="ติดตามสถานะการเติมเกมทุกรายการของคุณ" />
    <section className="member-card" aria-label={t("รายการคำสั่งซื้อ")}>
      <div className="orders-toolbar">
        <div className="orders-tabs" role="group" aria-label={t("กรองตามสถานะ")}>{filters.map(value => <button key={value} type="button" aria-pressed={status === value} onClick={() => setStatus(value)}>{t(value === "all" ? "ทั้งหมด" : statusLabels[value])}<span>{count(value)}</span></button>)}</div>
        <label className="orders-search"><MagnifyingGlassIcon aria-hidden="true" /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t("ค้นหาชื่อเกมหรือเลขคำสั่งซื้อ")} aria-label={t("ค้นหาชื่อเกมหรือเลขคำสั่งซื้อ")} /></label>
      </div>
      <p className="member-recent-note">{t("รายการด้านล่างเป็นตัวอย่าง ไม่ใช่ธุรกรรมจริง")}</p>
      {visible.length ? <OrderList orders={visible} /> : <AccountEmpty level={2} title="ไม่พบรายการที่ตรงกับตัวกรอง" text="ลองเปลี่ยนสถานะหรือคำค้นหา" />}
      <div className="orders-foot"><span>{t("ทั้งหมด")} {visible.length} {t("รายการ")}</span><Link href="/help">{t("มีปัญหากับคำสั่งซื้อ? ติดต่อทีมงาน")}</Link></div>
    </section>
  </>;
}

/* ---------- การแจ้งเตือน (inbox) ---------- */
function Inbox({ email }: { email: string }) {
  const { t } = useI18n();
  const { items, unread, isRead, markRead, markAllRead } = useNotifications(email);
  const [onlyUnread, setOnlyUnread] = useState(false);
  const shown = onlyUnread ? items.filter(item => !isRead(item.id)) : items;
  return <>
    <PageTitle title={accountSections.notifications} text="สถานะคำสั่งซื้อ การเติมเงิน และข่าวสารจาก THX2PAY" />
    <section className="member-card ntf-page" aria-label={t("รายการแจ้งเตือน")}>
      <div className="ntf-page-tools">
        <div className="ntf-filter" role="group" aria-label={t("แสดง")}><button type="button" aria-pressed={!onlyUnread} onClick={() => setOnlyUnread(false)}>{t("ทั้งหมด")}</button><button type="button" aria-pressed={onlyUnread} onClick={() => setOnlyUnread(true)}>{t("ยังไม่อ่าน")}{unread > 0 && <span>{unread}</span>}</button></div>
        <div className="settings-actions"><button type="button" className="ntf-text-btn" disabled={!unread} onClick={markAllRead}>{t("อ่านทั้งหมด")}</button><Link className="ntf-text-btn" href="/account/settings#notifications">{t("ตั้งค่าการแจ้งเตือน")}</Link></div>
      </div>
      <p className="member-recent-note">{t("ตัวอย่างการแจ้งเตือน ยังไม่ใช่ข้อมูลจริง")}</p>
      {shown.length ? <NotificationList items={shown} isRead={isRead} onOpen={item => markRead(item.id)} /> : <AccountEmpty level={2} title="อ่านครบทุกรายการแล้ว" text="การแจ้งเตือนใหม่จะแสดงที่นี่" />}
    </section>
  </>;
}

/* ---------- UID ของฉัน ---------- */
function SavedUIDs({ email }: { email: string }) {
  const { t } = useI18n();
  const { items, save } = useSavedUIDs(email);
  const [game, setGame] = useState(games[0].id);
  const [uid, setUID] = useState("");
  const [message, setMessage] = useState("");
  function add(event: FormEvent) {
    event.preventDefault();
    const value = uid.trim();
    if (!value) return;
    if (items.some(item => item.game === game && item.uid === value)) { setMessage("UID นี้บันทึกไว้แล้ว"); return; }
    if (save([...items, { id: crypto.randomUUID(), game, uid: value }])) { setUID(""); setMessage("บันทึกแล้ว"); } else setMessage("บันทึกไม่สำเร็จ กรุณาอนุญาตการจัดเก็บข้อมูลในเบราว์เซอร์");
  }
  return <>
    <PageTitle title={accountSections.uids} text="บันทึกไอดีเกมไว้ ครั้งหน้าเติมได้ทันทีโดยไม่ต้องพิมพ์ใหม่" />
    <div className="uids-layout">
      <section className="member-card" aria-labelledby="uid-add-title">
        <h2 id="uid-add-title" className="uids-title">{t("เพิ่ม UID")}</h2>
        <form className="acct-form uids-form" onSubmit={add}>
          <div className="member-game-field"><label htmlFor="saved-uid-game">{t("เกม")}</label><GameSelect id="saved-uid-game" value={game} onValueChange={setGame} /></div>
          <label>UID<input required maxLength={100} value={uid} onChange={event => setUID(event.target.value)} autoComplete="off" placeholder={t("เช่น 1234567890")} /></label>
          <button className="pill" type="submit">{t("บันทึก UID")}</button>
        </form>
        <p role="status" className="uids-status">{t(message)}</p>
        <p className="member-inline-note"><ReaderIcon />{t("UID จะถูกบันทึกไว้เฉพาะในเบราว์เซอร์นี้")}</p>
      </section>
      <section className="member-card" aria-labelledby="uid-list-title">
        <h2 id="uid-list-title" className="uids-title">{t("UID ที่บันทึกไว้")} <span className="uids-count">{items.length}</span></h2>
        {items.length ? <ul className="uids-list">{items.map(item => { const entry = games.find(g => g.id === item.game); return <li key={item.id}>
          {entry && <Image src={entry.icon} alt="" width={44} height={44} />}
          <div><strong>{entry?.name ?? item.game}</strong><span>{item.uid}</span></div>
          <Link className="member-button" href={`/topup?game=${item.game}`}>{t("เติมเกม")}</Link>
          <button type="button" className="uids-delete" aria-label={`${t("ลบ")} ${entry?.name ?? item.game} ${item.uid}`} onClick={() => { if (save(items.filter(other => other.id !== item.id))) setMessage("ลบแล้ว"); }}><TrashIcon /></button>
        </li>; })}</ul> : <AccountEmpty title="ยังไม่มี UID ที่บันทึกไว้" text="เพิ่ม UID ของเกมที่เล่นบ่อย เพื่อเติมได้เร็วขึ้น" />}
      </section>
    </div>
  </>;
}

/* ---------- ตั้งค่าบัญชี (ข้อมูลส่วนตัว · ความปลอดภัย · การแจ้งเตือน · การแสดงผล) ---------- */
const notificationRows = [
  { key: "orders", title: "แจ้งเตือนคำสั่งซื้อ", text: "แจ้งเมื่อมีการสั่งซื้อสำเร็จหรือเปลี่ยนสถานะ" },
  { key: "wallet", title: "เติมเงินและเครดิต", text: "แจ้งเมื่อเติมเงินสำเร็จหรือได้รับเครดิต" },
  { key: "security", title: "ความปลอดภัยของบัญชี", text: "แจ้งเตือนการเข้าสู่ระบบและกิจกรรมที่สำคัญ" },
  { key: "promos", title: "โปรโมชั่นและข่าวสาร", text: "รับข้อมูลโปรโมชั่น เกมใหม่ และสิทธิพิเศษ" },
] as const;

function Settings({ user }: { user: User }) {
  const { t } = useI18n();
  const { updateName } = useAuth();
  const { prefs, toggle } = usePreferences(user.email);
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState("");
  const [current, setCurrent] = useState<string>(settingsSections[0].id);

  // Links like /account/settings#security arrive before this content renders, so scroll once it exists.
  useEffect(() => {
    const go = () => { const id = window.location.hash.slice(1); if (id) document.getElementById(id)?.scrollIntoView({ block: "start" }); };
    const timer = window.setTimeout(go, 150); // after the router's own scroll-to-top
    window.addEventListener("hashchange", go);
    return () => { window.clearTimeout(timer); window.removeEventListener("hashchange", go); };
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const top = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (top) setCurrent(top.target.id);
    }, { rootMargin: "-140px 0px -55% 0px" });
    settingsSections.forEach(item => { const el = document.getElementById(item.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, []);

  function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) { setMessage("กรุณากรอกชื่อที่แสดง"); return; }
    try { updateName(name); setMessage("บันทึกแล้ว"); } catch { setMessage("บันทึกไม่สำเร็จ กรุณาอนุญาตการจัดเก็บข้อมูลในเบราว์เซอร์"); }
  }

  return <>
    <PageTitle title={accountSections.settings} text="จัดการข้อมูลส่วนตัว รหัสผ่าน การแจ้งเตือน และการแสดงผลในหน้าเดียว" />
    <nav className="settings-jump" aria-label={t("ไปยังหัวข้อ")}>{settingsSections.map(item => <a key={item.id} href={`#${item.id}`} className={current === item.id ? "active" : ""} aria-current={current === item.id ? "true" : undefined}><AccountIcon name={item.icon} />{t(item.label)}</a>)}</nav>

    <div className="settings-stack">
      <section id="profile" className="member-card settings-block" aria-labelledby="profile-title">
        <h2 id="profile-title">{t("ข้อมูลส่วนตัว")}</h2>
        <form className="acct-form settings-profile" onSubmit={saveProfile}>
          <Avatar name={name || user.name} size={64} />
          <div className="settings-fields">
            <label>{t("ชื่อที่แสดง")}<input required maxLength={80} value={name} autoComplete="nickname" onChange={event => { setName(event.target.value); setMessage(""); }} /></label>
            <label>{t("อีเมล")}<input value={user.email} readOnly type="email" aria-describedby="email-note" /><small id="email-note">{t("อีเมลใช้เข้าสู่ระบบ ติดต่อทีมงานหากต้องการเปลี่ยน")}</small></label>
            <div className="settings-actions"><button className="member-button" type="submit" disabled={name.trim() === user.name}>{t("บันทึกการเปลี่ยนแปลง")}</button>{message && <span role="status" className="settings-saved">{message === "บันทึกแล้ว" && <CheckIcon />}{t(message)}</span>}</div>
          </div>
        </form>
      </section>

      <div id="security" className="settings-anchor"><PasswordChangeCard email={user.email} /></div>

      <section id="notifications" className="member-card settings-block" aria-labelledby="notifications-title">
        <h2 id="notifications-title">{t("ตั้งค่าการแจ้งเตือน")}</h2>
        <div className="member-notification-rows">{notificationRows.map(row => <div key={row.key}><span className="member-icon blue"><BellIcon /></span><div><b>{t(row.title)}</b><p>{t(row.text)}</p></div><button type="button" role="switch" aria-label={t(row.title)} aria-checked={!!prefs[row.key]} className="member-switch" onClick={() => toggle(row.key)}><span /></button></div>)}</div>
        <p className="member-info-note">{t("บันทึกตัวเลือกในเบราว์เซอร์นี้ ยังไม่ส่งการแจ้งเตือนจริง")}</p>
      </section>

      <section id="display" className="member-card settings-block" aria-labelledby="display-title">
        <h2 id="display-title">{t("การแสดงผล")}</h2>
        <div className="acct-settings"><div><div><b>{t("ภาษา")}</b><p>{t("เลือกภาษาที่ต้องการใช้งาน")}</p></div><LanguageSwitcher /></div><div><div><b>{t("ธีมการแสดงผล")}</b><p>{t("เลือกธีมมืดหรือสว่าง")}</p></div><ThemeToggle /></div></div>
      </section>
    </div>
  </>;
}
