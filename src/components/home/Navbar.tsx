"use client";

import { useI18n } from "@/i18n/useI18n";

import Link from "next/link";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState, type MouseEvent } from "react";
import { DropdownMenu } from "radix-ui";
import { HamburgerMenuIcon, MagnifyingGlassIcon, ChevronRightIcon, ChevronDownIcon, Cross2Icon } from "@radix-ui/react-icons";
import LanguageSwitcher from "./LanguageSwitcher";
import BrandLogo from "./BrandLogo";
import UserMenu from "@/auth/UserMenu";
import NotificationBell from "@/auth/NotificationBell";
import { useAuth } from "@/auth/AuthProvider";
import type { NavTarget } from "./types";
import { afterTopupLinks, boxesLink, homeLink, navIcons, topupLinks, topupTargets, type NavLink } from "./navLinks";
import "./mobile-menu.css";
import "./nav-dropdown.css";
import "./nav-actions.css";
import "./nav-capsule.css";

const MotionLink = motion.create(Link);

const mobileLinks: NavLink[] = [homeLink, ...topupLinks, afterTopupLinks[0], boxesLink, ...afterTopupLinks.slice(1)];
const mobileIcons = navIcons;

export default function Navbar({ onToggleSearch, searchOpen, activePage = "home" }: { activePage?: NavTarget | null; onToggleSearch: () => void; searchOpen: boolean }) {
  const { t } = useI18n();
  const [menu, setMenu] = useState(false);
  const { user } = useAuth();
  // Hide the bar while scrolling down, bring it back as soon as the user scrolls up (always shown near the top).
  const [hidden, setHidden] = useState(false);
  const lastY = useRef(0);
  useEffect(() => {
    lastY.current = window.scrollY;
    function onScroll() {
      const y = window.scrollY;
      const delta = y - lastY.current;
      if (Math.abs(delta) < 6) return;
      setHidden(delta > 0 && y > 80);
      lastY.current = y;
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  const navHidden = hidden && !menu && !searchOpen;

  function navigateToTop(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    setMenu(false);
    window.scrollTo({ top: 0, behavior: "instant" });
  }
  return (
    <header className={`site-header${navHidden ? " is-hidden" : ""}`}>
      <div className="nav-wrap">
        <BrandLogo eager lightVariant className="navbar-logo" onClick={navigateToTop} />
        <button className="mobile-menu icon-button" aria-label={t(menu ? "ปิดเมนู" : "เปิดเมนู")} aria-expanded={menu} aria-controls="mobile-navigation" onClick={() => setMenu(!menu)}>
          {menu ? <Cross2Icon aria-hidden="true" /> : <HamburgerMenuIcon aria-hidden="true" />}
        </button>
        <nav id="primary-navigation" aria-label={t("เมนูหลัก")} className="desktop-navigation">
          {[homeLink].map(link => (
            <MotionLink whileHover={{ y: -2 }} whileTap={{ scale: 0.96 }} key={link.target} href={link.href} scroll={false} className={activePage === link.target ? "active" : ""} aria-current={activePage === link.target ? "page" : undefined} onClick={navigateToTop}>
              {t(link.label)}
            </MotionLink>
          ))}
          <DropdownMenu.Root modal={false}>
            <DropdownMenu.Trigger className={`nav-dropdown-trigger${activePage && topupTargets.has(activePage) ? " active" : ""}`}>
              {t("เติมเงิน")}<ChevronDownIcon aria-hidden="true" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content className="nav-dropdown" align="start" sideOffset={4} collisionPadding={16}>
                {topupLinks.map(link => {
                  const Icon = mobileIcons[link.target];
                  return <DropdownMenu.Item key={link.target} asChild>
                    <Link href={link.href} scroll={false} className={`nav-dropdown-item${activePage === link.target ? " active" : ""}`} aria-current={activePage === link.target ? "page" : undefined} onClick={navigateToTop}>
                      <span className="nav-dropdown-icon"><Icon /></span>
                      <span className="nav-dropdown-text"><b>{t(link.label)}</b><small>{t(link.description)}</small></span>
                    </Link>
                  </DropdownMenu.Item>;
                })}
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
          {afterTopupLinks.map(link => (
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
                <div className="app-menu-grid">{mobileLinks.map(link => {
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
          <LanguageSwitcher withTheme />
          <button className="icon-button" aria-label={t("ค้นหา")} aria-haspopup="dialog" aria-expanded={searchOpen} aria-controls="site-search" onClick={() => { setMenu(false); onToggleSearch(); }}>
            <MagnifyingGlassIcon />
          </button>
          {user && <NotificationBell />}
          {user ? <UserMenu /> : <MotionLink whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.96 }} className="pill" href="/login" scroll={false} onClick={navigateToTop}>{t("เข้าสู่ระบบ")}</MotionLink>}
        </div>
      </div>
    </header>
  );
}
