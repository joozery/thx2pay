"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import "@/components/topup/topup.css";
import "./news.css";

// No news feed yet: the page shows an empty state until real articles are connected.
export default function NewsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="news" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page news-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("ข่าวสาร")}</span></nav>
      <PageHero id="news-title" eyebrow="THX2PAY NEWS" title="ข่าวสาร" accent="อัปเดตล่าสุดจาก THX2PAY" description="ประกาศ เกมใหม่ และกิจกรรมต่าง ๆ จาก THX2PAY" image="/images/hero-lion.webp" imageAlt="มาสคอต THX2PAY พร้อมของขวัญ" cta={{ label: "ดูโปรโมชั่น", href: "/promotions" }} />
      <section className="news-empty" aria-labelledby="news-empty-title">
        <span className="news-empty-icon" aria-hidden="true"><ReaderIcon /></span>
        <h2 id="news-empty-title">{t("ยังไม่มีข่าวสารในตอนนี้")}</h2>
        <p>{t("ติดตามโปรโมชั่นและสิทธิพิเศษล่าสุดได้ระหว่างนี้")}</p>
        <Link className="pill" href="/promotions">{t("ดูโปรโมชั่น")}<ArrowRightIcon /></Link>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
