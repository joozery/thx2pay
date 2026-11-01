"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon, CopyIcon, CalendarIcon, CubeIcon, SpeakerLoudIcon, ReaderIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import { coupons, promoCategories, promotions, type Coupon, type Promotion } from "./data";
import "@/components/partner/partner.css";
import "./promotions.css";

function CouponCard({ coupon }: { coupon: Coupon }) {
  const { t } = useI18n();
  const [status, setStatus] = useState<"idle" | "copied" | "error">("idle");
  async function copy() {
    try {
      await navigator.clipboard.writeText(coupon.code);
      setStatus("copied");
    } catch {
      setStatus("error");
    }
  }
  return <li className="promos-coupon">
    <div className="promos-coupon-detail"><span className="promos-icon"><ReaderIcon /></span><div><h3>{t(coupon.title)}</h3><p>{t(coupon.text)}</p><small>{t(coupon.until)}</small></div></div>
    <div className="promos-coupon-code"><code>{coupon.code}</code><button onClick={copy} className={status === "copied" ? "is-copied" : ""} aria-label={`${t("คัดลอกโค้ด")} ${coupon.code}`}>{status === "copied" ? <CheckIcon /> : <CopyIcon />}{t(status === "copied" ? "คัดลอกแล้ว" : "คัดลอก")}</button></div>
    <span className="promos-copy-status" role="status">{status === "error" ? t("คัดลอกไม่สำเร็จ กรุณาเลือกคัดลอกโค้ดด้วยตนเอง") : status === "copied" ? `${t("คัดลอกแล้ว")} ${coupon.code}` : ""}</span>
  </li>;
}

export default function PromotionsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [selected, setSelected] = useState<Promotion | null>(null);
  const visible = promotions.filter(p => category === "all" || p.category === category);
  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }
  return <>
    <Navbar activePage="promotions" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container partner-page promos-page" id="top">
      <div className="partner-breadcrumb" role="navigation" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("โปรโมชั่น")}</span></div>
      <PageHero id="promotions-title" eyebrow="THX2PAY OFFERS" title="โปรโมชั่น" accent="ดีลและสิทธิพิเศษ" description="ติดตามสิทธิพิเศษและข่าวสารจาก THX2PAY ได้ที่นี่" image="/images/hero-lion.webp" imageAlt="มาสคอต THX2PAY พร้อมของขวัญ" cta={{ label: "ดูโปรโมชั่น", href: "#active-promotions" }} />
      <p className="promos-preview-note">{t("โปรโมชั่นและโค้ดด้านล่างเป็นตัวอย่าง ยังไม่สามารถใช้รับส่วนลดได้")}</p>
      <section className="promos-section" aria-labelledby="promos-coupons-title">
        <div className="promos-section-head"><span className="promos-icon"><ReaderIcon /></span><div><h2 id="promos-coupons-title">{t("โค้ดส่วนลด")}</h2><p>{t("คัดลอกโค้ดแล้วนำไปใช้ตอนชำระเงิน")}</p></div></div>
        <ul className="promos-coupons">{coupons.map(c => <CouponCard key={c.code} coupon={c} />)}</ul>
      </section>
      <section className="promos-section" id="active-promotions" aria-labelledby="promos-all-title">
        <div className="promos-section-head"><span className="promos-icon coral"><SpeakerLoudIcon /></span><div><h2 id="promos-all-title">{t("โปรโมชั่นทั้งหมด")} <span className="promos-count" aria-live="polite">({visible.length})</span></h2><p>{t("เลือกดูโปรโมชั่นตามประเภทสินค้า")}</p></div></div>
        <div className="promos-filters" role="group" aria-label={t("ประเภทโปรโมชั่น")}>{["all", ...promoCategories].map(c => <button key={c} aria-pressed={category === c} onClick={() => setCategory(c)}>{t(c === "all" ? "ทั้งหมด" : c)}<span>{c === "all" ? promotions.length : promotions.filter(p => p.category === c).length}</span></button>)}</div>
        <ul className="promos-grid">{visible.map(p => <li key={p.id}><article className="promos-card">
          <div className="promos-card-art"><Image src={p.image} alt="" fill sizes="(max-width: 599px) 100vw, (max-width: 1199px) 50vw, 25vw" /><span className="promos-badge">{t(p.badge)}</span>{p.hot && <span className="promos-hot">HOT</span>}</div>
          <div className="promos-card-body"><span className="promos-card-category">{t(p.category)}</span><h3>{t(p.title)}</h3><p>{t(p.desc)}</p><small><CalendarIcon />{t(p.until)}</small><button className="promos-card-cta" onClick={() => setSelected(p)}>{t("ดูรายละเอียด")}<ArrowRightIcon /></button></div>
        </article></li>)}</ul>
      </section>
      <aside className="promos-partner"><span className="promos-icon"><CubeIcon /></span><div><h2>{t("สมัครตัวแทน รับส่วนลดพิเศษ")}</h2><p>{t("ร่วมเป็นตัวแทนจำหน่าย THX2PAY เพื่อรับส่วนลดและสิทธิประโยชน์สำหรับการจำหน่ายต่อ")}</p></div><Link href="/partner" className="promos-partner-link">{t("ดูรายละเอียด")}<ArrowRightIcon /></Link></aside>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <Dialog.Root open={!!selected} onOpenChange={open => { if (!open) setSelected(null); }}>
      <Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog promos-dialog">
        <Dialog.Title>{selected && t(selected.title)}</Dialog.Title>
        <Dialog.Description>{selected && t(selected.desc)}</Dialog.Description>
        <p className="promos-dialog-note">{t("โปรโมชั่นและโค้ดด้านล่างเป็นตัวอย่าง ยังไม่สามารถใช้รับส่วนลดได้")}</p>
        {selected && <Link className="pill" href={selected.href}>{t("เลือกดูสินค้า")}<ArrowRightIcon /></Link>}
        <Dialog.Close className="promos-dialog-close">{t("ปิด")}</Dialog.Close>
      </Dialog.Content></Dialog.Portal>
    </Dialog.Root>
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
