"use client";

import { useI18n } from "@/i18n/useI18n";

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

const copyVariants: Variants = {
  enter: ({ direction, reduced }: SlideMotion) => ({ opacity: 0, x: reduced ? 0 : direction * 32 }),
  visible: { opacity: 1, x: 0 },
  exit: ({ direction, reduced }: SlideMotion) => ({ opacity: 0, x: reduced ? 0 : direction * -24 }),
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
  const banners = [["โปรโมชั่นพิเศษ", "สมัครตัวแทน", "รับส่วนลดพิเศษ", "ยิ่งเติมเยอะ ยิ่งได้ราคาสุดคุ้มกว่าใคร"], ["เกมยอดฮิตรวมไว้ที่เดียว", "เติมเกมยอดฮิต", "ไอเทมเข้าทันใจ!", "Free Fire · RoV · PUBG Mobile · Valorant"], ["พร้อมดูแลคุณ", "ทุกความสนุก", "เริ่มต้นที่นี่", "มั่นใจทุกการเติม กับทีมงาน THX2PAY"]];
  const banner = banners[slide];
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
      <AnimatePresence initial={false} custom={motionData} mode="sync">
      <motion.div key={slide} className="hero-copy" custom={motionData} variants={copyVariants} initial="enter" animate="visible" exit="exit" transition={{ duration: reduceMotion ? 0.12 : 0.32, ease: "easeOut" }}>
        <span className="eyebrow">
          {t(banner[0])}
        </span>
        <h1>
          {t(banner[1])}
          <br />
          {t(banner[2])}
        </h1>
        <p>
          {t(banner[3])}
        </p>
      </motion.div>
      </AnimatePresence>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="hero-arrow prev" aria-label={t("โปรโมชั่นก่อนหน้า")} onClick={() => changeSlide((slide + 2) % banners.length, -1)}>
        <ChevronLeftIcon />
      </motion.button>
      <motion.button whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.92 }} className="hero-arrow next" aria-label={t("โปรโมชั่นถัดไป")} onClick={() => changeSlide((slide + 1) % banners.length, 1)}>
        <ChevronRightIcon />
      </motion.button>
      <div className="dots">
        {banners.map((_, i) => <button aria-label={t("โปรโมชั่น {{number}}", { number: i + 1 })} aria-pressed={slide === i} className={slide === i ? "selected" : ""} onClick={() => changeSlide(i, i > slide ? 1 : -1)} key={i} />)}
      </div>
      <div className="quick-links">
        <a href="#categories">{t("เติมเงิน")}{" "}<span>
          <ChevronRightIcon />
        </span></a>
        <button onClick={() => { onSelectGiftCards(); }}>{t("ซื้อพรีเมียม")}{" "}<span>
          <ChevronRightIcon />
        </span></button>
      </div>
    </section>
  );
}
