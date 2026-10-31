"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { DashboardIcon, HomeIcon, IdCardIcon, StarIcon, PersonIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import { Avatar } from "./UserMenu";
import "./account.css";
import "./mobile-tab-bar.css";

const tabs = [
  { label: "หน้าแรก", href: "/", icon: <HomeIcon /> },
  { label: "บัตร", href: "/cards", icon: <IdCardIcon /> },
  { label: "เติมเกม", href: "/topup", icon: <DashboardIcon /> },
  { label: "โปรโมชั่น", href: "/promotions", icon: <StarIcon /> },
];

export default function MobileTabBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const { user } = useAuth();
  const accountActive = pathname === "/account" || pathname.startsWith("/account/") || pathname === "/login";
  return <nav className="app-tab-bar" aria-label={t("เมนูล่างบนมือถือ")}>
    {tabs.map(tab => {
      const active = tab.href === "/" ? pathname === "/" : pathname === tab.href || pathname.startsWith(tab.href + "/");
      return <Link key={tab.label} href={tab.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}><span className="app-tab-icon">{tab.icon}</span><span className="app-tab-label">{t(tab.label)}</span></Link>;
    })}
    {user ? <button type="button" className={accountActive ? "active" : ""} aria-current={accountActive ? "page" : undefined} onClick={() => window.dispatchEvent(new Event("thx2pay-open-account"))}><span className="app-tab-icon"><Avatar name={user.name} size={23} /></span><span className="app-tab-label">{t("บัญชี")}</span></button> : <Link href="/login" className={accountActive ? "active" : ""} aria-current={accountActive ? "page" : undefined}><span className="app-tab-icon"><PersonIcon /></span><span className="app-tab-label">{t("บัญชี")}</span></Link>}
  </nav>;
}
