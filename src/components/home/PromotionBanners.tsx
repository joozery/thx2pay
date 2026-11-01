"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import "./promotion-banners.css";

const banners = [
  { id: "offers", image: "/images/banners/offers-v1.webp", label: "SPECIAL OFFERS", title: "โปรโมชั่นและดีลพิเศษ", text: "รวมสิทธิพิเศษสำหรับเกมโปรดของคุณ", cta: "ดูโปรโมชั่น", href: "/promotions", tone: "blue" },
  { id: "partner", image: "/images/banners/partner-v1.webp", label: "PARTNER BENEFITS", title: "สมัครตัวแทน รับส่วนลดพิเศษ", text: "ร่วมเติบโตไปกับ THX2PAY", cta: "สมัครเป็นตัวแทน", href: "/partner", tone: "violet" },
  { id: "topup", image: "/images/banners/topup-v1.webp", label: "PLAY MORE", title: "เติมเกมยอดฮิต", text: "เลือกเติมเกมโปรดของคุณได้ในที่เดียว", cta: "ดูเกมทั้งหมด", href: "/topup", tone: "teal" },
];

export default function PromotionBanners() {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ page: 0, pages: 1 });

  useEffect(() => {
    const el = track.current;
    if (!el) return;
    function update() {
      if (!el) return;
      const step = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
      const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
      const stride = step + gap;
      const max = Math.max(0, el.scrollWidth - el.clientWidth);
      setPosition({ page: Math.min(Math.round(el.scrollLeft / stride), Math.ceil(max / stride)), pages: Math.ceil(max / stride) + 1 });
    }
    const observer = new ResizeObserver(update);
    observer.observe(el);
    el.addEventListener("scroll", update, { passive: true });
    update();
    return () => { observer.disconnect(); el.removeEventListener("scroll", update); };
  }, []);

  function goTo(page: number) {
    const el = track.current;
    if (!el) return;
    const width = el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    const gap = parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollTo({ left: page * (width + gap), behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  }

  return <section className="promotion-banners" aria-labelledby="promotion-banners-title" aria-roledescription={t("สไลด์แบนเนอร์")}>
    <div className="promotion-banners-head"><div><span>THX2PAY OFFERS</span><h2 id="promotion-banners-title">{t("โปรโมชั่นและดีลพิเศษ")}</h2></div><Link href="/promotions">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div>
    <div className="promotion-banners-track" ref={track}>
      {banners.map((banner, index) => <Link href={banner.href} key={banner.id} className={`promotion-banner ${banner.tone}`} aria-label={`${t(banner.title)} — ${t(banner.cta)}`}>
        <Image src={banner.image} alt="" fill sizes="(max-width: 760px) 90vw, 45vw" />
        <div className="promotion-banner-shade" />
        <div className="promotion-banner-copy"><span>{banner.label}</span><h3>{t(banner.title)}</h3><p>{t(banner.text)}</p><span className="promotion-banner-cta">{t(banner.cta)}<ArrowRightIcon /></span></div>
        <span className="promotion-banner-number" aria-hidden="true">0{index + 1}</span>
      </Link>)}
    </div>
    <div className="promotion-banners-controls">
      <div className="promotion-banners-dots">{Array.from({ length: position.pages }, (_, page) => <button key={page} type="button" aria-label={t("แบนเนอร์หน้า {{number}}", { number: page + 1 })} aria-pressed={position.page === page} onClick={() => goTo(page)} />)}</div>
      <div className="promotion-banners-arrows"><button type="button" aria-label={t("โปรโมชั่นก่อนหน้า")} disabled={position.page === 0} onClick={() => goTo(position.page - 1)}><ChevronLeftIcon /></button><button type="button" aria-label={t("โปรโมชั่นถัดไป")} disabled={position.page === position.pages - 1} onClick={() => goTo(position.page + 1)}><ChevronRightIcon /></button></div>
    </div>
  </section>;
}
