"use client";

import { useI18n } from "@/i18n/useI18n";

import { useState } from "react";
import { ChevronRightIcon, ChatBubbleIcon, InstagramLogoIcon, VideoIcon } from "@radix-ui/react-icons";
import type { DialogHandler } from "./types";

export default function SocialFollowRail({ onOpenDialog }: { onOpenDialog: DialogHandler }) {
  const { t } = useI18n();
  const [socialOpen, setSocialOpen] = useState(true);
  const [mobileExpanded, setMobileExpanded] = useState(false);
  return (
    <aside className={`follow-rail ${socialOpen ? "" : "collapsed"}`} aria-label={t("ช่องทางติดตาม")} data-mobile-open={mobileExpanded}>
      <button className="follow-toggle follow-toggle-desktop" aria-label={t(socialOpen ? "ย่อช่องทางติดตาม" : "แสดงช่องทางติดตาม")} aria-expanded={socialOpen} onClick={() => setSocialOpen(!socialOpen)}>
        <ChevronRightIcon />
      </button>
      <button className="follow-toggle follow-toggle-mobile" aria-label={t(mobileExpanded ? "ย่อช่องทางติดตาม" : "แสดงช่องทางติดตาม")} aria-expanded={mobileExpanded} onClick={() => setMobileExpanded(value => !value)}><ChevronRightIcon /></button>
      {(socialOpen || mobileExpanded) && <><strong>{t("ติดตาม")}</strong>{["Facebook", "แชต", "Instagram", "TikTok", "YouTube"].map((name, i) => <button className="follow-link" aria-label={t(name)} key={name} onClick={() => onOpenDialog(`ติดต่อเรา · ${name}`)}>
        {i === 0 ? <span>f</span> : i === 1 ? <ChatBubbleIcon /> : i === 2 ? <InstagramLogoIcon /> : i === 3 ? <span>♪</span> : <VideoIcon />}
      </button>)}</>}
    </aside>
  );
}
