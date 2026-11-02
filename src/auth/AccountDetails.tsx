"use client";

import { useMemo, useState, useSyncExternalStore, type FormEvent } from "react";
import Link from "next/link";
import { BellIcon, PersonIcon, GearIcon, ReaderIcon, MagnifyingGlassIcon, CheckIcon } from "@radix-ui/react-icons";
import GameSelect from "./GameSelect";
import PasswordChangeCard from "./PasswordChangeCard";
import { Avatar } from "./UserMenu";
import { AccountEmpty, AccountStats } from "./AccountDashboard";
import { useI18n } from "@/i18n/useI18n";
import ThemeToggle from "@/components/home/ThemeToggle";
import LanguageSwitcher from "@/components/home/LanguageSwitcher";
import { useAuth, type User } from "./AuthProvider";
import { accountSections, type AccountSection } from "./accountMenu";
import { games } from "@/components/topup/games";

type SavedUID = { id: string; game: string; uid: string };
const uidEvent = "thx2pay-uids-change";
function subscribe(callback: () => void) {
  window.addEventListener(uidEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(uidEvent, callback); window.removeEventListener("storage", callback); };
}
function SavedUIDs({ email }: { email: string }) {
  const { t } = useI18n();
  const key = `thx2pay-uids:${email}`;
  const raw = useSyncExternalStore(subscribe, () => { try { return localStorage.getItem(key); } catch { return null; } }, () => null);
  const items = useMemo<SavedUID[]>(() => {
    try {
      const parsed: unknown = JSON.parse(raw ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item): item is SavedUID => !!item && typeof item.id === "string" && typeof item.game === "string" && typeof item.uid === "string") : [];
    } catch { return []; }
  }, [raw]);
  const [game, setGame] = useState(games[0].id);
  const [uid, setUID] = useState("");
  const [message, setMessage] = useState("");
  function save(next: SavedUID[]) {
    try { localStorage.setItem(key, JSON.stringify(next)); window.dispatchEvent(new Event(uidEvent)); return true; }
    catch { setMessage("บันทึกไม่สำเร็จ กรุณาอนุญาตการจัดเก็บข้อมูลในเบราว์เซอร์"); return false; }
  }
  function add(event: FormEvent) {
    event.preventDefault();
    const value = uid.trim();
    if (!value) return;
    if (items.some(item => item.game === game && item.uid === value)) { setMessage("UID นี้บันทึกไว้แล้ว"); return; }
    if (save([...items, { id: crypto.randomUUID(), game, uid: value }])) { setUID(""); setMessage("บันทึกแล้ว"); }
  }
  return <>
    <div className="member-inline-note"><ReaderIcon /><p>{t("UID จะถูกบันทึกไว้เฉพาะในเบราว์เซอร์นี้")}</p></div>
    <form className="acct-form" onSubmit={add}>
      <div className="member-game-field"><label htmlFor="saved-uid-game">{t("เกม")}</label><GameSelect id="saved-uid-game" value={game} onValueChange={setGame} /></div>
      <label>UID<input required maxLength={100} value={uid} onChange={event => setUID(event.target.value)} autoComplete="off" /></label>
      <button className="pill" type="submit">{t("บันทึก UID")}</button>
    </form>
    <p role="status">{t(message)}</p>
    {items.length ? <ul className="acct-uid-list">{items.map(item => <li key={item.id}><div><strong>{games.find(game => game.id === item.game)?.name ?? item.game}</strong><span>{item.uid}</span></div><button type="button" onClick={() => { if (save(items.filter(other => other.id !== item.id))) setMessage("ลบแล้ว"); }}>{t("ลบ")}</button></li>)}</ul> : <AccountEmpty title="ยังไม่มี UID ที่บันทึกไว้" text="บันทึก UID เกมโปรด เพื่อให้เลือกใช้งานได้สะดวกขึ้น" />}
  </>;
}

export default function AccountDetails({ section, user }: { section: AccountSection; user: User }) {
  const { t } = useI18n();
  const { updateName } = useAuth();
  const [name, setName] = useState(user.name);
  const [message, setMessage] = useState("");
  function saveProfile(event: FormEvent) {
    event.preventDefault();
    if (!name.trim()) { setMessage("กรุณากรอกชื่อที่แสดง"); return; }
    try { updateName(name); setMessage("บันทึกแล้ว"); }
    catch { setMessage("บันทึกไม่สำเร็จ กรุณาอนุญาตการจัดเก็บข้อมูลในเบราว์เซอร์"); }
  }
  const profileForm = <section className="member-card"><div className="member-card-head"><span className="member-icon blue"><PersonIcon /></span><div><h2>{t("ข้อมูลส่วนตัว")}</h2><p>{t("จัดการข้อมูลส่วนตัวของคุณ")}</p></div></div><form className="acct-form member-profile-form" onSubmit={saveProfile}><div className="member-form-avatar"><Avatar name={name || user.name} size={88} /><strong>{user.name}</strong><small>{t("สมาชิก THX2PAY")}</small></div><div className="member-form-fields"><label>{t("ชื่อที่แสดง")}<input required maxLength={80} value={name} autoComplete="nickname" onChange={event => setName(event.target.value)} /></label><label>{t("อีเมล")}<input value={user.email} readOnly type="email" /></label><div className="member-form-foot"><p>{t("ข้อมูลโปรไฟล์จะถูกบันทึกไว้เฉพาะในเบราว์เซอร์นี้")}</p><button className="member-button" type="submit">{t("บันทึกการเปลี่ยนแปลง")}</button></div><p role="status">{t(message)}</p></div></form></section>;
  const security = <PasswordChangeCard email={user.email} />;
  const appearance = <section className="member-card"><div className="member-card-head"><span className="member-icon blue"><GearIcon /></span><div><h2>{t("การแสดงผล")}</h2><p>{t("ปรับแต่งให้เป็นสไตล์ของคุณ")}</p></div></div><div className="acct-settings"><div><div><b>{t("ภาษา")}</b><p>{t("เลือกภาษาที่ต้องการใช้งาน")}</p></div><LanguageSwitcher /></div><div><div><b>{t("ธีมการแสดงผล")}</b><p>{t("เลือกธีมมืดหรือสว่าง")}</p></div><ThemeToggle /></div></div></section>;
  return <div className="member-detail-content" aria-label={t(accountSections[section])}>
    {(section === "profile" || section === "edit") && <div className="member-settings-grid"><div>{profileForm}</div><div>{appearance}<section className="member-card member-tip"><CheckIcon /><h2>{t("ข้อมูลของคุณ")}</h2><p>{t("ข้อมูลโปรไฟล์จะถูกบันทึกไว้เฉพาะในเบราว์เซอร์นี้")}</p><Link href="/account/profile" className="acct-detail-link">{t("ดูโปรไฟล์")}</Link></section></div></div>}
    {section === "security" && <div className="member-settings-grid"><div>{security}</div><div><section className="member-card"><div className="member-card-head"><span className="member-icon blue"><PersonIcon /></span><h2>{t("บัญชีปัจจุบัน")}</h2></div><div className="member-session"><span className="member-session-dot" /><div><b>{user.name}</b><p>{user.email}</p><small>{t("เบราว์เซอร์นี้")}</small></div></div></section></div></div>}
    {section === "history" && <OrderHistory />}
    {section === "uids" && <section className="member-card"><div className="member-card-head"><span className="member-icon blue"><ReaderIcon /></span><div><h2>{t("UID ที่บันทึกไว้")}</h2><p>{t("จัดการไอดีเกมของคุณในที่เดียว")}</p></div></div><SavedUIDs email={user.email} /></section>}
    {section === "notifications" && <div className="member-settings-grid"><NotificationSettings email={user.email} /><section className="member-card"><AccountEmpty title="ยังไม่มีการแจ้งเตือน" text="ติดตามข่าวสารและสิทธิพิเศษได้ที่หน้าโปรโมชั่น" href="/promotions" action="ดูโปรโมชั่น" /></section></div>}
    {section === "settings" && <div className="member-settings-grid"><div>{profileForm}<NotificationSettings email={user.email} /></div><div>{security}{appearance}</div></div>}
  </div>;
}

function OrderHistory() {
  const { t } = useI18n();
  const [status, setStatus] = useState("ทั้งหมด");
  const [query, setQuery] = useState("");
  const [date, setDate] = useState("");
  return <><AccountStats /><section className="member-card"><div className="member-history-tabs">{["ทั้งหมด", "สำเร็จแล้ว", "กำลังดำเนินการ", "ยกเลิก"].map(label => <button key={label} type="button" aria-pressed={label === status} onClick={() => setStatus(label)}>{t(label)}<span>0</span></button>)}</div><div className="member-history-filters"><label><MagnifyingGlassIcon /><input value={query} onChange={event => setQuery(event.target.value)} placeholder={t("ค้นหารายการหรือชื่อเกม")} aria-label={t("ค้นหารายการหรือชื่อเกม")} /></label><input type="date" value={date} onChange={event => setDate(event.target.value)} aria-label={t("วันที่ทำรายการ")} /><button type="button" onClick={() => {setQuery("");setDate("");setStatus("ทั้งหมด");}}>{t("ล้างตัวกรอง")}</button></div><div className="member-table-head" aria-hidden="true"><span>{t("รายการ")}</span><span>{t("วันที่ทำรายการ")}</span><span>{t("จำนวนเงิน")}</span><span>{t("สถานะ")}</span></div><AccountEmpty title={query || date || status !== "ทั้งหมด" ? "ไม่พบรายการที่ตรงกับตัวกรอง" : "ยังไม่มีประวัติการเติม"} text="เมื่อเปิดให้บริการชำระเงินจริง ประวัติรายการจะแสดงที่นี่" href="/topup" action="ดูเกมทั้งหมด" /><div className="member-table-footer">{t("ทั้งหมด")} 0 {t("รายการ")}</div></section></>;
}

const notificationRows = [
  { key: "orders", title: "แจ้งเตือนคำสั่งซื้อ", text: "แจ้งเมื่อมีการสั่งซื้อสำเร็จหรือเปลี่ยนสถานะ" },
  { key: "promos", title: "โปรโมชั่นและข่าวสาร", text: "รับข้อมูลโปรโมชั่น เกมใหม่ และสิทธิพิเศษ" },
  { key: "wallet", title: "เติมเงินและเครดิต", text: "แจ้งเมื่อเติมเงินสำเร็จหรือได้รับเครดิต" },
  { key: "security", title: "ความปลอดภัยของบัญชี", text: "แจ้งเตือนการเข้าสู่ระบบและกิจกรรมที่สำคัญ" },
] as const;
function NotificationSettings({ email }: { email: string }) {
  const { t } = useI18n();
  const key = `thx2pay-notifications:${email}`;
  const raw = useSyncExternalStore(subscribe, () => {try{return localStorage.getItem(key);}catch{return null;}}, () => null);
  const preferences = useMemo<Record<string, boolean>>(() => {try {const value:unknown=JSON.parse(raw ?? "{}");return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string,boolean> : {};}catch{return {};}}, [raw]);
  const [error,setError] = useState("");
  function toggle(topic: string) {
    try{localStorage.setItem(key,JSON.stringify({...preferences,[topic]:!preferences[topic]}));window.dispatchEvent(new Event(uidEvent));setError("");}
    catch{setError("บันทึกไม่สำเร็จ กรุณาอนุญาตการจัดเก็บข้อมูลในเบราว์เซอร์");}
  }
  return <section className="member-card"><div className="member-card-head"><span className="member-icon amber"><BellIcon /></span><div><h2>{t("การแจ้งเตือน")}</h2><p>{t("เลือกประเภทข่าวสารที่คุณสนใจ")}</p></div></div><div className="member-notification-rows">{notificationRows.map(row => <div key={row.key}><span className="member-icon blue"><BellIcon /></span><div><b>{t(row.title)}</b><p>{t(row.text)}</p></div><button type="button" role="switch" aria-label={t(row.title)} aria-checked={!!preferences[row.key]} className="member-switch" onClick={() => toggle(row.key)}><span /></button></div>)}</div><p className="member-info-note">{t("บันทึกตัวเลือกในเบราว์เซอร์นี้ ยังไม่ส่งการแจ้งเตือนจริง")}</p><p role="status">{t(error)}</p></section>;
}
