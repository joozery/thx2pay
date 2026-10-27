"use client";

import { useI18n } from "@/i18n/useI18n";

import { motion } from "motion/react";
import type { KeyboardEvent } from "react";
import PlatformIcon from "./PlatformIcon";
import { platforms, type Platform } from "./types";
import "./platform-tabs.css";

export default function PlatformTabs({ tab, onTabChange }: { tab: Platform; onTabChange: (platform: Platform) => void }) {
  const { t } = useI18n();
  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    let nextIndex: number;
    switch (event.key) {
      case "ArrowRight": nextIndex = (index + 1) % platforms.length; break;
      case "ArrowLeft": nextIndex = (index - 1 + platforms.length) % platforms.length; break;
      case "Home": nextIndex = 0; break;
      case "End": nextIndex = platforms.length - 1; break;
      default: return;
    }
    event.preventDefault();
    onTabChange(platforms[nextIndex]);
    event.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('[role="tab"]')[nextIndex]?.focus();
  }

  return (
    <div className="platforms platform-tabs" role="tablist" aria-label={t("แพลตฟอร์ม")}>
      {platforms.map((name, index) => (
        <motion.button
          key={name}
          type="button"
          role="tab"
          id={`platform-tab-${index}`}
          aria-selected={tab === name}
          aria-controls="categories"
          tabIndex={tab === name ? 0 : -1}
          className={tab === name ? "selected" : ""}
          whileTap={{ scale: 0.96 }}
          onClick={() => onTabChange(name)}
          onKeyDown={event => handleKeyDown(event, index)}
        >
          <PlatformIcon platform={name} />
          {t(name)}
        </motion.button>
      ))}
    </div>
  );
}
