"use client";

import { useI18n } from "@/i18n/useI18n";

import { AnimatePresence, motion } from "motion/react";
import { useState } from "react";
import { MixerHorizontalIcon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import BrandLogo from "./BrandLogo";
import type { DialogHandler, NavTarget } from "./types";

const links: { label: string; target: NavTarget; href: string }[] = [
  { label: "หน้าแรก", target: "home", href: "#top" },
  { label: "เติมเกม", target: "games", href: "#categories" },
  { label: "บัตรเติมเงิน", target: "cards", href: "#categories" },
  { label: "โปรโมชั่น", target: "promotions", href: "#promotions" },
  { label: "พาร์ทเนอร์", target: "partner", href: "#partner" },
  { label: "ช่วยเหลือ", target: "help", href: "#about" },
];

export default function Navbar({ onOpenDialog, onToggleSearch, onNavigate, searchOpen }: { onOpenDialog: DialogHandler; onToggleSearch: () => void; onNavigate: (target: NavTarget) => void; searchOpen: boolean }) {
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);
  const [active, setActive] = useState<NavTarget>("home");

  function navigate(target: NavTarget) {
    setMenu(false);
    setActive(target);
    onNavigate(target);
  }
  return (
    <header className="site-header">
      <div className="nav-wrap">
        <BrandLogo eager className="navbar-logo" onClick={event => { event.preventDefault(); navigate("home"); }} />
        <button className="mobile-menu icon-button" aria-label={t("เปิดเมนู")} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>
          <MixerHorizontalIcon />
        </button>
        <nav id="primary-navigation" aria-label={t("เมนูหลัก")} className="desktop-navigation">
          {links.map(link => (
            <motion.a whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} key={link.target} href={link.href} className={active === link.target ? "active" : ""} aria-current={active === link.target ? "location" : undefined} onClick={event => { event.preventDefault(); navigate(link.target); }}>
              {t(link.label)}
            </motion.a>
          ))}
        </nav>
        <AnimatePresence>
          {menu && (
            <motion.nav id="mobile-navigation" aria-label={t("เมนูหลักบนมือถือ")} className="mobile-navigation open" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>
              {links.map(link => (
                <a key={link.target} href={link.href} className={active === link.target ? "active" : ""} aria-current={active === link.target ? "location" : undefined} onClick={event => { event.preventDefault(); navigate(link.target); }}>
                  {t(link.label)}
                </a>
              ))}
            </motion.nav>
          )}
        </AnimatePresence>
        <div className="nav-actions">
          <LanguageSwitcher />
          <ThemeToggle />
          <button className="icon-button" aria-label={t("ค้นหา")} aria-haspopup="dialog" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => { setMenu(false); onToggleSearch(); }}>
            <MagnifyingGlassIcon />
          </button>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="pill" onClick={() => onOpenDialog("เข้าสู่ระบบ")}>{t("เข้าสู่ระบบ")}</motion.button>
        </div>
      </div>
    </header>
  );
}
