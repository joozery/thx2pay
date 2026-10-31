"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { games, type Game } from "@/components/topup/games";
import { premiumApps } from "./premiumApps";
import RevealSection from "./RevealSection";
import "@/components/topup/game-card.css";
import "./home-showcase.css";

const limit = 12;
const recommended = games.filter(game => game.tag === "recommended").slice(0, limit);
const newest = games.filter(game => game.tag === "new").slice(0, limit);

// Example price, same placeholder as the cards page until the real catalog is connected.
const samplePrice = 100;

function SectionHead({ id, label, title, text, href }: { id: string; label: string; title: string; text: string; href: string }) {
  const { t } = useI18n();
  return <div className="showcase-head"><div><span className="showcase-label">{label}</span><h2 id={id}>{t(title)}</h2><p>{t(text)}</p></div><Link href={href} className="showcase-all">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div>;
}

// Horizontal slider: native scroll-snap plus arrow buttons.
function Slider({ children, label }: { children: ReactNode; label: string }) {
  const { t } = useI18n();
  const track = useRef<HTMLDivElement>(null);
  const [edge, setEdge] = useState({ start: true, end: false });

  function update() {
    const el = track.current;
    if (!el) return;
    setEdge({ start: el.scrollLeft <= 2, end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2 });
  }
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const observer = new ResizeObserver(update);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  function move(direction: number) {
    const el = track.current;
    if (el) el.scrollBy({ left: direction * el.clientWidth * 0.9 });
  }
  return <div className="showcase-slider">
    <button type="button" className="slider-arrow prev" aria-label={`${t("ก่อนหน้า")} ${t(label)}`} hidden={edge.start} onClick={() => move(-1)}><ChevronLeftIcon /></button>
    <div className="showcase-grid" ref={track} onScroll={update}>{children}</div>
    <button type="button" className="slider-arrow next" aria-label={`${t("ถัดไป")} ${t(label)}`} hidden={edge.end} onClick={() => move(1)}><ChevronRightIcon /></button>
  </div>;
}

function GameGrid({ items, href, kind, label }: { items: Game[]; href: string; kind: "topup" | "card"; label: string }) {
  const { t } = useI18n();
  return <Slider label={label}>
    {items.map(game => <div className="gc" key={game.id}><Link href={href} className="gc-button" aria-label={`${t(kind === "card" ? "บัตรเติมเงิน" : "เติมเกม")} ${game.name}`}>
      <span className="gc-art"><Image src={game.icon} alt="" fill sizes="(max-width: 760px) 40vw, 190px" style={{ objectFit: "cover" }} />{game.tag && <span className={`gc-tag ${game.tag}`}>{t(game.tag === "new" ? "มาใหม่" : "เกมแนะนำ")}</span>}</span>
      <span className="gc-info"><span className="gc-text"><b>{game.name}</b>{kind === "card" ? <span className="gc-price"><small>{t("เริ่มต้น")}</small><strong>฿{samplePrice}</strong><em>{t("ตัวอย่าง")}</em></span> : <small>{game.genre} · {game.platforms.join(", ")}</small>}</span><ChevronRightIcon aria-hidden="true" /></span>
    </Link></div>)}
  </Slider>;
}

function PremiumGrid() {
  const { t } = useI18n();
  return <Slider label="แอพพรีเมียม">
    {premiumApps.map(app => <div className="gc" key={app.id}><Link href="/cards" className="gc-button" aria-label={`${t("ซื้อพรีเมียม")} ${app.name}`}>
      <span className="gc-art gc-logo" style={{ background: app.color }} aria-hidden="true"><Image src={app.logo} alt="" width={72} height={72} unoptimized /></span>
      <span className="gc-info"><span className="gc-text"><b>{app.name}</b><small>{t(app.category)}</small></span><ChevronRightIcon aria-hidden="true" /></span>
    </Link></div>)}
  </Slider>;
}

export default function HomeShowcase() {
  return <>
    <RevealSection id="home-games" className="showcase" aria-labelledby="home-recommended-title">
      <SectionHead id="home-recommended-title" label="RECOMMENDED" title="เกมแนะนำ" text="เกมยอดนิยมที่เติมกันมากที่สุด" href="/topup" />
      <GameGrid items={recommended} href="/topup" kind="topup" label="เกมแนะนำ" />
    </RevealSection>

    <RevealSection id="home-new" className="showcase" aria-labelledby="home-new-title">
      <SectionHead id="home-new-title" label="NEW ARRIVALS" title="เกมมาใหม่" text="เกมที่เพิ่งเข้ามาใหม่ เติมได้แล้ววันนี้" href="/topup" />
      <GameGrid items={newest} href="/topup" kind="topup" label="เกมมาใหม่" />
    </RevealSection>

    <RevealSection id="home-premium" className="showcase" aria-labelledby="home-premium-title">
      <SectionHead id="home-premium-title" label="PREMIUM APPS" title="แอพพรีเมียม" text="แอพยอดนิยมสำหรับดูหนัง ฟังเพลง และทำงาน" href="/cards" />
      <PremiumGrid />
    </RevealSection>

    <RevealSection id="home-cards" className="showcase" aria-labelledby="home-cards-title">
      <SectionHead id="home-cards-title" label="DIGITAL CARDS & CODES" title="บัตรเติมเงิน" text="เลือกบัตรเติมเกมจากเกมที่คุณชอบ" href="/cards" />
      <GameGrid items={recommended} href="/cards" kind="card" label="บัตรเติมเงิน" />
    </RevealSection>
  </>;
}
