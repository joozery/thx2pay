"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ArrowRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import "./hero-v2.css";

type PageHeroProps = {
  id: string;
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  cta: { label: string; href: string };
  imagePosition?: string;
};

export default function PageHero({ id, eyebrow, title, accent, description, image, imageAlt, cta, imagePosition }: PageHeroProps) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  return (
    <section className="hx hx-page" aria-labelledby={id}>
      <div className="hx-banner">
        <div className="hx-media"><Image src={image} alt={t(imageAlt)} fill priority sizes="(max-width: 760px) 100vw, 1180px" style={imagePosition ? { objectPosition: imagePosition } : undefined} /></div>
        <div className="hx-shade" aria-hidden="true" />
        <motion.div className="hx-copy" initial={reduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: "easeOut" }}>
          <span className="hx-eyebrow">{eyebrow}</span>
          <h1 id={id}>{t(title)}<br /><span>{t(accent)}</span></h1>
          <p>{t(description)}</p>
          <div className="hx-cta"><a className="hx-btn primary" href={cta.href}>{t(cta.label)}<ArrowRightIcon /></a></div>
        </motion.div>
      </div>
    </section>
  );
}
