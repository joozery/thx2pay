"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon, MixIcon, RocketIcon, TargetIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import BoxCard from "./BoxCard";
import { mysteryBoxes } from "./boxes";
import "@/components/topup/topup.css";
import "@/components/accounts/accounts.css";
import "./boxes.css";

const howTo = [
  { icon: TargetIcon, title: "เลือกกล่องของเกมที่เล่น", text: "แต่ละกล่องแสดงของรางวัลและอัตราออกครบ" },
  { icon: MixIcon, title: "เปิดกล่องแล้วลุ้นรางวัล", text: "รางเลื่อนหมุนแล้วหยุดที่รางวัลของคุณ" },
  { icon: RocketIcon, title: "รับของรางวัลทันที", text: "ไอเทมส่งเข้า UID หรือส่งข้อมูลไอดีทางอีเมล" },
];

export default function BoxesPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "ไอดีเกม" ? "/accounts" : "/topup");
  }

  return <>
    <Navbar activePage="boxes" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page accounts-page boxes-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("กล่องสุ่ม")}</span></nav>
      <PageHero id="boxes-title" eyebrow="MYSTERY BOX" title="กล่องสุ่มเกม" accent="เปิดกล่อง ลุ้นรางวัลใหญ่" description="เปิดกล่องของเกมโปรด ลุ้นไอเทมและไอดีเกม พร้อมแสดงอัตราออกรางวัลทุกกล่อง" image="/images/promotions/mystery-box.png" imageAlt="กล่องสุ่ม" cta={{ label: "เลือกกล่อง", href: "#boxes-list" }} />

      <ul className="accounts-trust">{howTo.map(({ icon: Icon, title, text }) => <li key={title}><span><Icon /></span><div><b>{t(title)}</b><small>{t(text)}</small></div></li>)}</ul>

      <section id="boxes-list" className="topup-catalog" aria-labelledby="boxes-list-title">
        <div className="topup-catalog-heading"><div><span className="topup-section-label">MYSTERY BOXES</span><h2 id="boxes-list-title">{t("เลือกกล่องสุ่ม")}</h2><p>{t("กดที่กล่องเพื่อดูของรางวัลและเปิดกล่อง")}</p></div></div>
        <div className="boxes-grid">{mysteryBoxes.map(box => <BoxCard key={box.id} box={box} />)}</div>
        <p className="accounts-note">{t("โหมดทดสอบ — การเปิดกล่องเป็นการจำลอง ไม่มีการเรียกเก็บเงินหรือส่งของรางวัลจริง")}</p>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
