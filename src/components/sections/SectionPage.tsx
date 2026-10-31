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
import "@/components/topup/topup.css";
import "./sections.css";

export type SectionKind = "cards" | "promotions" | "partner" | "help";

const pageContent: Record<SectionKind, {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  image: string;
  imageAlt: string;
  cards: { title: string; description: string; image?: string; href?: string }[];
}> = {
  cards: {
    eyebrow: "DIGITAL CARDS & CODES",
    title: "บัตรเติมเงิน",
    accent: "เลือกความสนุกได้ง่าย ๆ",
    description: "เลือกดูบัตรของขวัญและโค้ดเกมสำหรับความสนุกในแบบของคุณ",
    image: "/images/games/category-topup.webp",
    imageAlt: "บัตรเติมเงินและเกม",
    cards: [
      { title: "บัตรเติมเงิน", description: "สอบถามบัตรเติมเงินและช่องทางสั่งซื้อกับทีมงาน", image: "/images/games/category-topup.webp" },
      { title: "บัตรของขวัญ", description: "มอบความสนุกให้เพื่อนหรือคนพิเศษด้วยบัตรของขวัญ", image: "/images/games/category-accounts.webp" },
      { title: "โค้ดเกม", description: "ค้นหาโค้ดเกมที่สนใจและสอบถามรายละเอียดก่อนสั่งซื้อ", image: "/images/games/category-items.webp" },
    ],
  },
  promotions: {
    eyebrow: "THX2PAY OFFERS",
    title: "โปรโมชั่น",
    accent: "ดีลและสิทธิพิเศษ",
    description: "ติดตามสิทธิพิเศษและข่าวสารจาก THX2PAY ได้ที่นี่",
    image: "/images/hero-lion.webp",
    imageAlt: "มาสคอต THX2PAY พร้อมของขวัญ",
    cards: [
      { title: "สิทธิพิเศษสำหรับตัวแทน", description: "สนใจสมัครเป็นตัวแทนจำหน่าย? สอบถามสิทธิประโยชน์และเงื่อนไขกับทีมงาน", href: "/partner" },
      { title: "เติมเกมที่ชอบ", description: "เลือกเกมที่ต้องการเติมและสอบถามแพ็กเกจที่เหมาะกับคุณ", href: "/topup" },
    ],
  },
  partner: {
    eyebrow: "THX2PAY PARTNERS",
    title: "พาร์ทเนอร์",
    accent: "เติบโตไปด้วยกัน",
    description: "ร่วมเป็นตัวแทนจำหน่ายกับ THX2PAY และเติบโตไปด้วยกัน",
    image: "/images/hero-lion.webp",
    imageAlt: "มาสคอตสิงโต THX2PAY",
    cards: [
      { title: "เริ่มต้นพูดคุย", description: "แจ้งความสนใจและรูปแบบธุรกิจของคุณให้ทีมงานทราบ" },
      { title: "รับข้อมูลโครงการ", description: "ทีมงานจะแนะนำรายละเอียด สิทธิประโยชน์ และเงื่อนไขที่เกี่ยวข้อง" },
      { title: "เตรียมพร้อมจำหน่าย", description: "สอบถามรายการสินค้าและขั้นตอนการสั่งซื้อก่อนเริ่มต้น" },
    ],
  },
  help: {
    eyebrow: "THX2PAY SUPPORT",
    title: "ช่วยเหลือ",
    accent: "พร้อมดูแลคุณ",
    description: "รวมคำตอบที่พบบ่อยและช่องทางติดต่อทีมงาน THX2PAY",
    image: "/images/hero-games-refined.webp",
    imageAlt: "ภาพเกมแฟนตาซีและไซไฟ",
    cards: [
      { title: "เลือกเกมและแพ็กเกจ", description: "ดูเกมที่รองรับและสอบถามแพ็กเกจที่ต้องการ", href: "/topup" },
      { title: "ตรวจสอบ UID", description: "เปิดหน้าโปรไฟล์ในเกม คัดลอก UID หรือ Player ID แล้วตรวจสอบก่อนสั่งซื้อ" },
      { title: "ติดต่อทีมงาน", description: "ส่งคำถามพร้อมรายละเอียดเกมหรือหมายเลขคำสั่งซื้อเพื่อให้ทีมงานช่วยตรวจสอบ" },
    ],
  },
};

const faqs = [
  ["เติมเกมกับ THX2PAY ปลอดภัยไหม?", "ปลอดภัย เราดูแลข้อมูลของคุณและตรวจสอบทุกคำสั่งซื้อ พร้อมทีมงานให้ความช่วยเหลือตลอด 24 ชั่วโมง"],
  ["สามารถใช้วิธีชำระเงินใดได้?", "รองรับการโอนผ่านธนาคาร, PromptPay, TrueMoney และบัตรเครดิต ตามช่องทางที่แสดงในขั้นตอนชำระเงิน"],
  ["เติมแล้วใช้เวลานานไหม?", "ระบบจะดำเนินการหลังตรวจสอบการชำระเงิน ระยะเวลาขึ้นอยู่กับเกมและประเภทสินค้าที่เลือก"],
  ["ถ้าเติมผิดไอดีสามารถคืนเงินได้ไหม?", "กรุณาติดต่อทีมงานพร้อมหมายเลขคำสั่งซื้อ เพื่อตรวจสอบสถานะและเงื่อนไขของรายการก่อนดำเนินการ"],
];

export default function SectionPage({ kind }: { kind: SectionKind }) {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const content = pageContent[kind];

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage={kind} onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page section-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t(content.title)}</span></nav>
      <PageHero id="section-title" eyebrow={content.eyebrow} title={content.title} accent={content.accent} description={content.description} image={content.image} imageAlt={content.imageAlt} cta={{ label: kind === "partner" ? "สมัครตัวแทนจำหน่าย" : kind === "help" ? "สอบถามทีมงาน" : "ดูรายละเอียด", href: kind === "partner" ? "/partner/apply" : kind === "help" ? "mailto:support@thx2pay.com" : "#section-content" }} />
      <section id="section-content" className="section-content" aria-labelledby="section-content-title">
        <div className="section-heading"><div><span className="section-eyebrow">{content.eyebrow}</span><h2 id="section-content-title">{t(kind === "help" ? "เริ่มใช้งานและขอความช่วยเหลือ" : kind === "partner" ? "ร่วมงานกับเรา" : kind === "cards" ? "เลือกประเภทบัตร" : "สำรวจสิทธิพิเศษ")}</h2></div></div>
        <div className="section-card-grid">{content.cards.map(card => <article className="section-card" key={card.title}>
          {card.image && <div className="section-card-image"><Image src={card.image} alt="" fill sizes="(max-width: 760px) 100vw, 33vw" /></div>}
          <div className="section-card-copy"><h3>{t(card.title)}</h3><p>{t(card.description)}</p>{card.href ? <Link href={card.href}>{t("ดูรายละเอียด")}<ArrowRightIcon /></Link> : kind === "cards" ? <a href={`mailto:support@thx2pay.com?subject=${encodeURIComponent(card.title)}`}>{t("สอบถามทีมงาน")}<ArrowRightIcon /></a> : null}</div>
        </article>)}</div>
      </section>
      {kind === "help" && <section className="section-faq" aria-labelledby="section-faq-title"><h2 id="section-faq-title">{t("คำถามที่พบบ่อย")}</h2>{faqs.map(([question, answer]) => <details key={question}><summary>{t(question)}</summary><p>{t(answer)}</p></details>)}</section>}
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
