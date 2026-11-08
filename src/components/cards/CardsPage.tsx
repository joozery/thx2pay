"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import { games } from "@/components/topup/games";
import { findCardProduct } from "@/components/checkout/catalog";
import type { Category } from "@/components/home/categories";
import "@/components/topup/game-card.css";
import "./cards.css";

export default function CardsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const filteredGames = games.filter(game => `${game.name} ${game.aliases}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  // Starting price shown on each card = the cheapest card value in the shared catalog.
  const fromPrice = (id: string) => Math.min(...(findCardProduct(id)?.packages.map(item => item.price) ?? [0]));

  return <>
    <Navbar activePage="cards" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container cards-page" id="top">
      <nav className="cards-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("บัตรเติมเงิน")}</span></nav>
      <PageHero id="cards-title" eyebrow="DIGITAL CARDS & CODES" title="บัตรเติมเงิน" accent="เลือกความสนุกได้ง่าย ๆ" description="เลือกบัตรเติมเกมจากเกมที่คุณชอบ" image="/images/games/category-topup.webp" imageAlt="บัตรเติมเงินและเกม" cta={{ label: "เลือกบัตรเกม", href: "#cards-catalog" }} />

      <section className="cards-catalog" id="cards-catalog" aria-labelledby="cards-catalog-title">
        <div className="cards-catalog-heading"><div><span className="cards-kicker">GAME CARDS</span><h2 id="cards-catalog-title">{t("เลือกบัตรเติมเกม")}</h2><p>{t("เลือกเกมและราคาบัตรที่ต้องการ")}</p></div><span className="cards-count">{t("พบ {{count}} เกม", { count: filteredGames.length })}</span></div>
        <label className="cards-search"><MagnifyingGlassIcon aria-hidden="true" /><span className="sr-only">{t("ค้นหาชื่อเกม")}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("ค้นหาชื่อเกม")} />{query && <button type="button" aria-label={t("ล้างคำค้นหา")} onClick={() => setQuery("")}><Cross2Icon /></button>}</label>
        <div className="cards-game-grid">{filteredGames.map(game => <div className="gc" key={game.id}><Link className="gc-button" href={`/cards/${game.id}`} aria-label={`${t("เลือกซื้อบัตร")} ${game.name}`}>
          <span className="gc-art"><Image src={game.icon} alt="" fill sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 220px" style={{ objectFit: "cover" }} />{game.tag && <span className={`gc-tag ${game.tag}`}>{t(game.tag === "new" ? "มาใหม่" : "เกมแนะนำ")}</span>}</span>
          <span className="gc-info"><span className="gc-text"><b>{game.name}</b><span className="gc-price"><small>{t("เริ่มต้น")}</small><strong>฿{fromPrice(game.id)}</strong><em>{t("ตัวอย่าง")}</em></span></span><ChevronRightIcon aria-hidden="true" /></span>
        </Link></div>)}</div>
        {!filteredGames.length && <p className="cards-empty">{t("ไม่พบเกมที่ค้นหา")}</p>}
      </section>

    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
