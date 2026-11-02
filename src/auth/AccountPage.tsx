"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "@/components/flows/FlowShell";
import { useAuth } from "./AuthProvider";
import { accountGroups, accountGroupTitles, accountSections, type AccountSection } from "./accountMenu";
import AccountDetails from "./AccountDetails";
import AccountDashboard from "./AccountDashboard";
import AccountIcon from "./AccountIcon";
import "./account.css";
import "./member-pages.css";

const tabs = [
  { section: "profile", icon: "user", title: "โปรไฟล์" },
  { section: "history", icon: "history", title: "ประวัติการเติม" },
  { section: "uids", icon: "uid", title: "UID ที่บันทึกไว้" },
  { section: "edit", icon: "edit", title: "แก้ไขข้อมูลส่วนตัว" },
  { section: "security", icon: "lock", title: "ความปลอดภัย" },
  { section: "notifications", icon: "bell", title: "การแจ้งเตือน" },
  { section: "settings", icon: "gear", title: "ตั้งค่า" },
] as const;

export default function AccountPage({ section }: { section?: AccountSection }) {
  const { t } = useI18n();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  const overview = !section || section === "profile";
  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);
  return <FlowShell><div className="acct member-page">
    <div className="acct-crumb" role="navigation" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon />{section ? <><Link href="/account">{t("บัญชีของฉัน")}</Link><ChevronRightIcon /><span>{t(accountSections[section])}</span></> : <span>{t("บัญชีของฉัน")}</span>}</div>
    {ready && user ? <>
      {overview ? <div className="member-page-heading"><div><span>MY THX2PAY</span><h1>{t("บัญชีของฉัน")}</h1><p>{t("จัดการข้อมูลบัญชีและรายการต่าง ๆ ของคุณได้ที่นี่")}</p></div><button className="member-logout" onClick={() => { logout(); router.push("/"); }}><ExitIcon />{t("ออกจากระบบ")}</button></div> : <header className="member-section-hero"><div><span>MY THX2PAY</span><h1>{t(accountSections[section])}</h1><p>{t("จัดการข้อมูลบัญชีและรายการต่าง ๆ ของคุณได้ที่นี่")}</p></div><Image src="/images/banners/partner-v1.webp" alt="" fill sizes="(max-width: 760px) 250px, 500px" /></header>}
      <nav className="member-tabs" aria-label={t("เมนูบัญชี")}>{tabs.map(tab => <Link key={tab.section} href={`/account/${tab.section}`} aria-current={(section ?? "profile") === tab.section ? "page" : undefined}><AccountIcon name={tab.icon} />{t(tab.title)}</Link>)}</nav>
      {overview ? <AccountDashboard user={user} /> : <AccountDetails key={`${user.email}:${section}`} section={section} user={user} />}
      {overview && <div className="member-quick-menu">{accountGroups.map((group,index) => <section className="acct-group" key={index} aria-labelledby={`acct-g${index}`}><h2 id={`acct-g${index}`}>{t(accountGroupTitles[index])}</h2><div className="acct-items">{group.map(item => <Link key={item.label} href={item.href} className="acct-item"><span className="account-icon"><AccountIcon name={item.icon} /></span><span>{t(item.label)}</span><ChevronRightIcon /></Link>)}</div></section>)}</div>}
      <p className="member-demo-note">{t("บัญชีตัวอย่าง ข้อมูลจะบันทึกในเบราว์เซอร์นี้")}<Link href="/wallet/topup">{t("เติมเงิน")}<ArrowRightIcon /></Link></p>
    </> : <div className="member-loading" role="status">{t("กำลังโหลดข้อมูลบัญชี")}</div>}
  </div></FlowShell>;
}
