"use client";

import { useI18n } from "@/i18n/useI18n";

import { useState, useSyncExternalStore } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import { ChevronRightIcon, ChatBubbleIcon, InstagramLogoIcon, VideoIcon } from "@radix-ui/react-icons";
import type { DialogHandler } from "./types";
import "./follow-rail.css";
import { channelById, type ContactChannel } from "./contactChannels";

const channels = ["Facebook", "แชต", "Instagram", "TikTok", "YouTube"] as const;
const channelIds: ContactChannel["id"][] = ["facebook", "line", "instagram", "tiktok", "youtube"];
const icons = [<span key="f">f</span>, <ChatBubbleIcon key="chat" />, <InstagramLogoIcon key="ig" />, <span key="tt">♪</span>, <VideoIcon key="yt" />];

const mobileQuery = "(max-width: 760px)";
const subscribeMobile = (onChange: () => void) => { const media = window.matchMedia(mobileQuery); media.addEventListener("change", onChange); return () => media.removeEventListener("change", onChange); };
const isMobileNow = () => window.matchMedia(mobileQuery).matches;

const spring = { type: "spring", stiffness: 380, damping: 32, mass: 0.8 } as const;

export default function SocialFollowRail({ onOpenDialog }: { onOpenDialog: DialogHandler }) {
  const { t } = useI18n();
  const reduce = useReducedMotion();
  const [socialOpen, setSocialOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  const isMobile = useSyncExternalStore(subscribeMobile, isMobileNow, () => false);
  const open = isMobile ? mobileExpanded : socialOpen;

  // Panel grows/shrinks smoothly; icons pop in one after another and leave in reverse.
  const panel: Variants = reduce
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : { closed: { height: 0, width: 0, opacity: 0, transition: { ...spring, staggerChildren: 0.02, staggerDirection: -1 } }, open: { height: "auto", width: "auto", opacity: 1, transition: { ...spring, when: "beforeChildren", staggerChildren: 0.045 } } };
  const item: Variants = reduce
    ? { closed: { opacity: 0 }, open: { opacity: 1 } }
    : { closed: { opacity: 0, scale: 0.6, y: 8, transition: { duration: 0.12 } }, open: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", stiffness: 520, damping: 24 } } };
  const toggleRotation = isMobile ? (open ? 180 : 0) : (open ? 0 : 180);

  return (
    <motion.aside className={open ? "follow-rail" : "follow-rail collapsed"} aria-label={t("ช่องทางติดตาม")} data-mobile-open={mobileExpanded} data-open={open}
      initial={reduce ? false : { x: 24, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ ...spring, delay: 0.3 }}>
      <motion.button className="follow-toggle" aria-label={t(open ? "ย่อช่องทางติดตาม" : "แสดงช่องทางติดตาม")} aria-expanded={open}
        onClick={() => isMobile ? setMobileExpanded(value => !value) : setSocialOpen(value => !value)}
        whileHover={reduce ? undefined : { scale: 1.08 }} whileTap={reduce ? undefined : { scale: 0.9 }}>
        <motion.span className="follow-toggle-icon" animate={{ rotate: toggleRotation }} transition={reduce ? { duration: 0 } : spring}><ChevronRightIcon /></motion.span>
      </motion.button>
      <AnimatePresence initial={false}>
        {open && <motion.div key="items" className="follow-items" variants={panel} initial="closed" animate="open" exit="closed">
          <motion.strong variants={item}>{t("ติดตาม")}</motion.strong>
          {channels.map((name, i) => <motion.button key={name} className="follow-link" aria-label={t(name)} onClick={() => { const href = channelById(channelIds[i]).href; if (href) window.open(href, "_blank", "noopener,noreferrer"); else onOpenDialog(`ติดต่อเรา · ${name}`); }}
            variants={item} whileHover={reduce ? undefined : { scale: 1.1, y: -1 }} whileTap={reduce ? undefined : { scale: 0.9 }}>
            {icons[i]}
          </motion.button>)}
        </motion.div>}
      </AnimatePresence>
    </motion.aside>
  );
}
