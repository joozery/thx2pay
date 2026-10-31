"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import { games } from "@/components/topup/games";
import "@/components/partner/partner.css";
import "@/components/topup/game-card.css";
import "./promotions.css";

const picks = games.filter(game => game.tag === "recommended").slice(0, 5);

export default function PromotionsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="promotions" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container partner-page promos-page" id="top">
      <div className="partner-breadcrumb" role="navigation" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("โปรโมชั่น")}</span></div>
      <PageHero id="promotions-title" eyebrow="THX2PAY OFFERS" title="โปรโมชั่น" accent="ดีลและสิทธิพิเศษ" description="ติดตามสิทธิพิเศษและข่าวสารจาก THX2PAY ได้ที่นี่" image="/images/hero-lion.webp" imageAlt="มาสคอต THX2PAY พร้อมของขวัญ" cta={{ label: "ดูโปรโมชั่น", href: "#active-promotions" }} />

      <section className="partner-block" id="active-promotions" aria-labelledby="promos-open-title">
        <div className="partner-head"><span className="partner-kicker">CURRENT OFFER</span><h2 id="promos-open-title">{t("โปรโมชั่นที่เปิดอยู่")}</h2></div>
        <article className="promos-offer">
          <div className="promos-offer-art"><Image src="/images/mascot-lion.webp" alt="" fill sizes="(max-width: 760px) 100vw, 280px" /></div>
          <div className="promos-offer-body">
            <span className="promos-status">{t("เปิดรับสมัคร")}</span>
            <h3>{t("สมัครตัวแทน รับส่วนลดพิเศษ")}</h3>
            <p>{t("ร่วมเป็นตัวแทนจำหน่าย THX2PAY เพื่อรับส่วนลดและสิทธิประโยชน์สำหรับการจำหน่ายต่อ รายละเอียดส่วนลดและเงื่อนไขแจ้งในขั้นตอนสมัคร")}</p>
            <div className="promos-offer-actions"><Link href="/partner/apply" className="pill">{t("สมัครเป็นตัวแทน")}<ArrowRightIcon /></Link><Link href="/partner" className="promos-link">{t("ดูรายละเอียด")}</Link></div>
          </div>
        </article>
      </section>

      <section className="partner-block" aria-labelledby="promos-games-title">
        <div className="partner-head promos-head"><div><span className="partner-kicker">GAME OFFERS</span><h2 id="promos-games-title">{t("โปรโมชั่นเติมเกม")}</h2></div><Link href="/topup" className="promos-link">{t("ดูเกมทั้งหมด")}<ArrowRightIcon /></Link></div>
        <p className="promos-empty">{t("ขณะนี้ยังไม่มีโปรโมชั่นเติมเกมที่ประกาศ เมื่อมีดีลใหม่จะแสดงที่หน้านี้ ระหว่างนี้เลือกเติมเกมแนะนำได้เลย")}</p>
        <div className="promos-grid">{picks.map(game => <div className="gc" key={game.id}><Link href="/topup" className="gc-button" aria-label={`${t("เติมเกม")} ${game.name}`}>
          <span className="gc-art"><Image src={game.icon} alt="" fill sizes="(max-width: 760px) 44vw, 200px" style={{ objectFit: "cover" }} />{game.tag && <span className={`gc-tag ${game.tag}`}>{t("เกมแนะนำ")}</span>}</span>
          <span className="gc-info"><span className="gc-text"><b>{game.name}</b><small>{game.genre} · {game.platforms.join(", ")}</small></span><ChevronRightIcon aria-hidden="true" /></span>
        </Link></div>)}</div>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
