"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import { premiumApps } from "@/components/home/premiumApps";
import type { Category } from "@/components/home/categories";
import "@/components/topup/topup.css";
import "@/components/topup/game-card.css";
import "./premium.css";

export default function PremiumPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="premium" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page premium-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("พรีเมียม")}</span></nav>
      <PageHero id="premium-title" eyebrow="PREMIUM APPS" title="แอพพรีเมียม" accent="ดูหนัง ฟังเพลง ทำงาน" description="แอพยอดนิยมสำหรับดูหนัง ฟังเพลง และทำงาน" image="/images/hero-games-refined.webp" imageAlt="ภาพวาดฮีโร่เกมแฟนตาซีและไซไฟ โทนน้ำเงินเข้ม" cta={{ label: "เลือกแอพ", href: "#premium-apps" }} />
      <section id="premium-apps" className="premium-apps" aria-labelledby="premium-apps-title">
        <div className="topup-catalog-heading"><div><span className="topup-section-label">PREMIUM APPS</span><h2 id="premium-apps-title">{t("เลือกแอพพรีเมียม")}</h2><p>{t("กดเลือกแอพเพื่อสอบถามแพ็กเกจกับทีมงาน")}</p></div></div>
        <div className="premium-grid">{premiumApps.map(app => <div className="gc" key={app.id}>
          <a className="gc-button" href={`mailto:support@thx2pay.com?subject=${encodeURIComponent(`${t("สอบถามแพ็กเกจ")} ${app.name}`)}`} aria-label={`${t("สอบถามแพ็กเกจ")} ${app.name}`}>
            <span className="gc-art gc-logo" style={{ background: app.color }} aria-hidden="true"><Image src={app.logo} alt="" width={72} height={72} unoptimized /></span>
            <span className="gc-info"><span className="gc-text"><b>{app.name}</b><small>{t(app.category)}</small></span><ChevronRightIcon aria-hidden="true" /></span>
          </a>
        </div>)}</div>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
