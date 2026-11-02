"use client";

import { useI18n } from "@/i18n/useI18n";

import Link from "next/link";
import { useState } from "react";
import { AnimatePresence, motion, useReducedMotion, type Variants } from "motion/react";
import "./hero-motion.css";
import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import Artwork from "./Artwork";
import HeroBackdrop from "./HeroBackdrop";

type SlideMotion = { direction: number; reduced: boolean };

const imageVariants: Variants = {
  enter: ({ direction, reduced }: SlideMotion) => ({ x: reduced ? 0 : `${direction * 100}%`, opacity: reduced ? 0 : 1 }),
  visible: { x: 0, opacity: 1 },
  exit: ({ direction, reduced }: SlideMotion) => ({ x: reduced ? 0 : `${direction * -100}%`, opacity: reduced ? 0 : 1 }),
};

export default function HeroSection({ slide, onSlideChange, onSelectGiftCards }: { slide: number; onSlideChange: (slide: number) => void; onSelectGiftCards: () => void }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const [direction, setDirection] = useState(1);
  const motionData: SlideMotion = { direction, reduced: !!reduceMotion };

  function changeSlide(next: number, nextDirection: number) {
    if (next === slide) return;
    setDirection(nextDirection);
    onSlideChange(next);
  }
  const banners = 3; // slide count (copy removed; the hero shows cover art only)
  return (
    <section id="promotions" className="hero" aria-label={t("โปรโมชั่น")}>
      <HeroBackdrop />
      <svg className="hero-clip-defs" aria-hidden="true" width="0" height="0">
        <defs>
          <clipPath id="hero-outline" clipPathUnits="objectBoundingBox">
            <path d="M .035 0 H .965 Q 1 0 1 .08 V .62 Q 1 .695 .967 .695 H .815 Q .78 .695 .78 .78 V .92 Q .78 1 .745 1 H .035 Q 0 1 0 .92 V .08 Q 0 0 .035 0 Z" />
          </clipPath>
        </defs>
      </svg>
      <div className="artwork hero-visual">
        <AnimatePresence initial={false} custom={motionData} mode="sync">
          <motion.div key={slide} className="hero-image-slide" custom={motionData} variants={imageVariants} initial="enter" animate="visible" exit="exit" transition={{ duration: reduceMotion ? 0.12 : 0.55, ease: [0.22, 1, 0.36, 1] }}>
            <Artwork eager src={slide === 0 ? "/images/hero-lion.webp" : "/images/hero-games-refined.webp"} sizes="88vw" w={1768} h={744} label={t(slide === 0 ? "สิงโตน้อยพร้อมของขวัญ" : "ภาพวาดฮีโร่เกมแฟนตาซีและไซไฟ โทนน้ำเงินเข้ม")} />
          </motion.div>
        </AnimatePresence>
      </div>
      {/* Hero shows the cover image only; heading stays for screen readers and SEO. */}
      <h1 className="hero-sr-only">{t("THX2PAY เติมเกมออนไลน์ บัตรเติมเงิน และแอพพรีเมียม")}</h1>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="hero-arrow prev" aria-label={t("โปรโมชั่นก่อนหน้า")} onClick={() => changeSlide((slide + banners - 1) % banners, -1)}>
        <ChevronLeftIcon />
      </motion.button>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="hero-arrow next" aria-label={t("โปรโมชั่นถัดไป")} onClick={() => changeSlide((slide + 1) % banners, 1)}>
        <ChevronRightIcon />
      </motion.button>
      <div className="dots">
        {Array.from({ length: banners }, (_, i) => <button aria-label={t("โปรโมชั่น {{number}}", { number: i + 1 })} aria-pressed={slide === i} className={slide === i ? "selected" : ""} onClick={() => changeSlide(i, i > slide ? 1 : -1)} key={i} />)}
      </div>
      <div className="quick-links">
        <Link href="/wallet/topup">{t("เติมเงิน")}{" "}<span>
          <ChevronRightIcon />
        </span></Link>
        <button onClick={() => { onSelectGiftCards(); }}>{t("ซื้อพรีเมียม")}{" "}<span>
          <ChevronRightIcon />
        </span></button>
      </div>
    </section>
  );
}
