"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { OPEN_EVENT, getCookieConsent, readConsentRaw, saveCookieConsent, subscribeConsent } from "./consentStore";
import "./cookie-consent.css";

const SERVER = "__server__";

const categories = [
  { key: "necessary", title: "คุกกี้ที่จำเป็น", text: "ใช้จดจำการเข้าสู่ระบบ ภาษา และธีม เว็บไซต์ทำงานไม่ได้หากปิดส่วนนี้" },
  { key: "analytics", title: "คุกกี้วิเคราะห์การใช้งาน", text: "ช่วยให้เรารู้ว่าหน้าไหนถูกใช้งานมาก เพื่อปรับปรุงเว็บไซต์" },
  { key: "marketing", title: "คุกกี้การตลาด", text: "ใช้แสดงโปรโมชั่นที่ตรงกับความสนใจของคุณ" },
] as const;

export default function CookieConsent() {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  // SERVER on the server and during hydration, so nothing renders until the browser's choice is known.
  const stored = useSyncExternalStore(subscribeConsent, readConsentRaw, () => SERVER);
  const [forcedOpen, setForcedOpen] = useState(false);
  const [settings, setSettings] = useState(false);
  const [choice, setChoice] = useState({ analytics: false, marketing: false });

  useEffect(() => {
    const open = () => {
      const current = getCookieConsent();
      setChoice({ analytics: current?.analytics ?? false, marketing: current?.marketing ?? false });
      setSettings(true);
      setForcedOpen(true);
    };
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, []);

  const visible = stored !== SERVER && (stored === null || forcedOpen);

  function save(next: { analytics: boolean; marketing: boolean }) {
    saveCookieConsent(next);
    setForcedOpen(false);
    setSettings(false);
  }

  return <AnimatePresence>
    {visible && <motion.section className="cookie-consent" role="dialog" aria-modal="false" aria-labelledby="cookie-title" aria-describedby="cookie-text"
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: 24 }} transition={{ duration: 0.25, ease: "easeOut" }}>
      <div className="cookie-head">
        <span className="cookie-icon" aria-hidden="true">🍪</span>
        <h2 id="cookie-title">{t("เว็บไซต์นี้ใช้คุกกี้")}</h2>
        {forcedOpen && <button type="button" className="cookie-close" aria-label={t("ปิด")} onClick={() => { setForcedOpen(false); setSettings(false); }}><Cross2Icon /></button>}
      </div>
      <p id="cookie-text">{t("เราใช้คุกกี้ที่จำเป็นเพื่อให้เว็บไซต์ทำงานได้ และขออนุญาตใช้คุกกี้เพิ่มเติมเพื่อปรับปรุงประสบการณ์ของคุณ")} <Link href="/privacy#cookies">{t("อ่านนโยบายความเป็นส่วนตัว")}</Link></p>

      {settings && <ul className="cookie-options">
        {categories.map(category => {
          const locked = category.key === "necessary";
          const checked = locked || choice[category.key];
          return <li key={category.key}>
            <div><strong>{t(category.title)}</strong><small>{t(category.text)}</small></div>
            <button type="button" role="switch" aria-checked={checked} aria-label={t(category.title)} disabled={locked} className="cookie-switch"
              onClick={() => { if (!locked) setChoice(value => ({ ...value, [category.key]: !value[category.key] })); }}><span /></button>
          </li>;
        })}
      </ul>}

      <div className="cookie-actions">
        {settings
          ? <button type="button" className="cookie-btn primary" onClick={() => save(choice)}>{t("บันทึกการตั้งค่า")}</button>
          : <>
            <button type="button" className="cookie-btn" onClick={() => save({ analytics: false, marketing: false })}>{t("เฉพาะที่จำเป็น")}</button>
            <button type="button" className="cookie-btn primary" onClick={() => save({ analytics: true, marketing: true })}>{t("ยอมรับทั้งหมด")}</button>
          </>}
        {!settings && <button type="button" className="cookie-link" onClick={() => setSettings(true)}>{t("ตั้งค่า")}</button>}
      </div>
    </motion.section>}
  </AnimatePresence>;
}
