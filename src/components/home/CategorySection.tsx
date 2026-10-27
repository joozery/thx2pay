"use client";

import { useI18n } from "@/i18n/useI18n";

import { useEffect, useRef } from "react";
import "./category-carousel.css";
import RevealSection from "./RevealSection";

import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { getCategories, matchesCategory } from "./categories";
import Artwork from "./Artwork";
import { platforms, type Platform, type DialogHandler } from "./types";

export default function CategorySection({ tab, query, onTabChange, onQueryChange, onOpenDialog }: { tab: Platform; query: string; onTabChange: (platform: Platform) => void; onQueryChange: (value: string) => void; onOpenDialog: DialogHandler }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gridRef.current?.scrollTo({ left: 0, behavior: "instant" });
  }, [tab, query]);

  function moveCategories(direction: number) {
    if (window.matchMedia("(max-width: 760px)").matches) {
      const grid = gridRef.current;
      const card = grid?.querySelector("article");
      if (grid && card) grid.scrollBy({ left: direction * (card.getBoundingClientRect().width + 16), behavior: reduceMotion ? "instant" : "smooth" });
    } else {
      onTabChange(platforms[(platforms.indexOf(tab) + direction + platforms.length) % platforms.length]);
    }
  }
  const search = query.trim();
  const filteredCategories = getCategories(tab).filter(category => matchesCategory(category, query));
  return (
    <RevealSection id="categories" className="categories" role="tabpanel" aria-labelledby={`platform-tab-${platforms.indexOf(tab)}`} tabIndex={0}>
      <div className="section-heading">
        <div>
          <h2>{t("หมวดหมู่ยอดนิยม")}</h2>
          <p>{t("เลือกซื้อได้ตามเกมที่คุณชอบ ·")}{" "}{tab}</p>
        </div>
        <div className="arrows">
          <button aria-label={t("หมวดหมู่ก่อนหน้า")} onClick={() => moveCategories(-1)}>‹</button>
          <button aria-label={t("หมวดหมู่ถัดไป")} onClick={() => moveCategories(1)}>›</button>
        </div>
      </div>
      {search && <div className="category-filter"><span>{t("หมวดที่เลือก:")}{" "}{t(search)}</span><button onClick={() => onQueryChange("")}>{t("แสดงทั้งหมด")}</button></div>}
      <motion.div ref={gridRef} layout className="category-grid" style={{ position: "relative" }} transition={{ duration: reduceMotion ? 0 : 0.3 }}>
        <AnimatePresence mode="popLayout">
        {filteredCategories.map(({ label, image }, index) => {
          return <motion.article
            key={`${tab}-${label}`}
            tabIndex={-1}
            layout="position"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.12 }}
            exit={{ opacity: 0, transition: { duration: reduceMotion ? 0 : 0.12 } }}
            whileHover={reduceMotion ? undefined : { y: -6, transition: { duration: 0.18, delay: 0 } }}
            whileTap={reduceMotion ? undefined : { scale: 0.985 }}
            transition={{ duration: reduceMotion ? 0 : 0.4, delay: reduceMotion ? 0 : index * 0.09, ease: "easeOut", layout: { duration: reduceMotion ? 0 : 0.3, delay: 0 } }}
          >
            <button className="category-image" onClick={() => onOpenDialog(`${label} · ${tab}`)}>
              <Artwork src={image} sizes="(max-width: 760px) 82vw, 33vw" w={16} h={9} label={`${t(label)} ${tab}`} />
            </button>
            <div className="category-caption">
              <h3>
                {t(label)}
              </h3>
              <motion.button whileHover={reduceMotion ? undefined : { scale: 1.04 }} whileTap={{ scale: 0.96 }} className="pill small" onClick={() => onOpenDialog(`${label} · ${tab}`)}>{t("➜ ดูทั้งหมด")}</motion.button>
            </div>
          </motion.article>;
        })}
        </AnimatePresence>
      </motion.div>
      {search && filteredCategories.length === 0 && <p className="empty">{t("ไม่พบหมวดหมู่ที่ค้นหา")}{" "}<button onClick={() => onQueryChange("")}>{t("ล้างการค้นหา")}</button></p>}
    </RevealSection>
  );
}
