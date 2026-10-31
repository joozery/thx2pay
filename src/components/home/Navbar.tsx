"use client";

import { useI18n } from "@/i18n/useI18n";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useState, type MouseEvent } from "react";
import { MixerHorizontalIcon, MagnifyingGlassIcon, HomeIcon, DashboardIcon, IdCardIcon, StarIcon, PersonIcon, QuestionMarkCircledIcon, ChevronRightIcon, Cross2Icon } from "@radix-ui/react-icons";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";
import UserMenu from "@/auth/UserMenu";
import { useAuth } from "@/auth/AuthProvider";
import type { NavTarget } from "./types";
import "./mobile-menu.css";

const MotionLink = motion.create(Link);

const links: { label: string; target: NavTarget; href: string }[] = [
  { label: "หน้าแรก", target: "home", href: "/" },
  { label: "เติมเกม", target: "games", href: "/topup" },
  { label: "บัตรเติมเงิน", target: "cards", href: "/cards" },
  { label: "โปรโมชั่น", target: "promotions", href: "/promotions" },
  { label: "พาร์ทเนอร์", target: "partner", href: "/partner" },
  { label: "ช่วยเหลือ", target: "help", href: "/help" },
];
const mobileIcons = { home: HomeIcon, games: DashboardIcon, cards: IdCardIcon, promotions: StarIcon, partner: PersonIcon, help: QuestionMarkCircledIcon };

export default function Navbar({ onToggleSearch, searchOpen, activePage = "home" }: { activePage?: NavTarget | null; onToggleSearch: () => void; searchOpen: boolean }) {
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);
  const { user } = useAuth();

  function navigateToTop(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <BrandLogo eager className="navbar-logo" onClick={navigateToTop} />
        <button className="mobile-menu icon-button" aria-label={t("เปิดเมนู")} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>
          <MixerHorizontalIcon />
        </button>
        <nav id="primary-navigation" aria-label={t("เมนูหลัก")} className="desktop-navigation">
          {links.map(link => (
            <MotionLink whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} key={link.target} href={link.href} scroll={false} className={activePage === link.target ? "active" : ""} aria-current={activePage === link.target ? "page" : undefined} onClick={navigateToTop}>
              {t(link.label)}
            </MotionLink>
          ))}
        </nav>
        <AnimatePresence>
          {menu && (
            <>
              <motion.button type="button" className="mobile-navigation-backdrop" aria-label={t("ปิดเมนู")} onClick={() => setMenu(false)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} />
              <motion.nav id="mobile-navigation" aria-label={t("เมนูหลักบนมือถือ")} className="mobile-navigation open app-menu-sheet" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.18 }}>
                <div className="app-menu-heading"><div><small>THX2PAY</small><strong>{t("เมนูทั้งหมด")}</strong></div><button type="button" aria-label={t("ปิดเมนู")} onClick={() => setMenu(false)}><Cross2Icon /></button></div>
                <div className="app-menu-grid">{links.map(link => {
                  const Icon = mobileIcons[link.target];
                  return <Link key={link.target} href={link.href} scroll={false} className={activePage === link.target ? "active" : ""} aria-current={activePage === link.target ? "page" : undefined} onClick={navigateToTop}>
                    <span className="app-menu-icon"><Icon /></span><span>{t(link.label)}</span><ChevronRightIcon className="app-menu-chevron" />
                  </Link>;
                })}</div>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
        <div className="nav-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="icon-button" aria-label={t("ค้นหา")} aria-haspopup="dialog" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => { setMenu(false); onToggleSearch(); }}>
            <MagnifyingGlassIcon />
          </button>
          {user ? <UserMenu /> : <MotionLink whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="pill" href="/login" scroll={false} onClick={navigateToTop}>{t("เข้าสู่ระบบ")}</MotionLink>}
        </div>
      </div>
    </header>
  );
}
