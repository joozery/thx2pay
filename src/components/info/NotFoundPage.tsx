"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ArrowLeftIcon, ArrowRightIcon, ChatBubbleIcon, CardStackIcon, HomeIcon, LightningBoltIcon, MagnifyingGlassIcon, StarIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import "./info.css";
import "./not-found.css";

const shortcuts = [
  { icon: LightningBoltIcon, title: "เติมเกม", text: "เติมเกมยอดนิยมด้วย UID", href: "/topup" },
  { icon: CardStackIcon, title: "บัตรเติมเงิน", text: "บัตรเติมเกมและบัตรของขวัญ", href: "/cards" },
  { icon: StarIcon, title: "พรีเมียม", text: "แอพดูหนัง ฟังเพลง และทำงาน", href: "/premium" },
  { icon: ChatBubbleIcon, title: "ช่วยเหลือ", text: "คำถามที่พบบ่อยและติดต่อทีมงาน", href: "/help" },
];

// Site-wide 404: shown for unmatched URLs and every notFound() call (app/not-found.tsx).
export default function NotFoundPage() {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function goBack() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return <>
    <Navbar activePage={null} onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container info-page nf-page" id="top" data-page="not-found">
      <section className="nf-hero" aria-labelledby="nf-title">
        <div className="nf-art" aria-hidden="true">
          <span className="nf-digit">4</span>
          <span className="nf-cat"><Image src="/images/404-cat.png" alt="" width={205} height={133} loading="eager" /></span>
          <span className="nf-digit">4</span>
        </div>
        <span className="info-eyebrow">ERROR 404</span>
        <h1 id="nf-title">{t("ไม่พบหน้าที่คุณกำลังหา")}</h1>
        <p>{t("หน้านี้อาจถูกย้าย ลบไปแล้ว หรือลิงก์พิมพ์ไม่ถูกต้อง ลองค้นหาเกมที่ต้องการ หรือกลับไปเริ่มที่หน้าแรก")}</p>
        {pathname && pathname !== "/" && <code className="nf-path" title={pathname}>{pathname}</code>}
        <div className="nf-actions">
          <Link className="pill" href="/"><HomeIcon />{t("กลับหน้าแรก")}</Link>
          <button type="button" className="info-ghost-button" onClick={() => setSearchOpen(true)}><MagnifyingGlassIcon />{t("ค้นหาเกม")}</button>
          <button type="button" className="nf-back" onClick={goBack}><ArrowLeftIcon />{t("ย้อนกลับ")}</button>
        </div>
      </section>

      <section className="nf-shortcuts" aria-labelledby="nf-shortcuts-title">
        <h2 id="nf-shortcuts-title">{t("หรือไปที่หน้ายอดนิยม")}</h2>
        <div>
          {shortcuts.map(({ icon: Icon, title, text, href }) => <Link key={href} href={href} className="nf-shortcut">
            <span className="nf-shortcut-icon"><Icon /></span>
            <span><b>{t(title)}</b><small>{t(text)}</small></span>
            <ArrowRightIcon className="nf-shortcut-arrow" />
          </Link>)}
        </div>
      </section>

      <p className="nf-report">{t("คิดว่าเป็นข้อผิดพลาดของเว็บไซต์?")} <Link href="/contact">{t("แจ้งทีมงาน")}</Link></p>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={category => { setSearchOpen(false); router.push(category.platform === "Gift Card" ? "/cards" : "/topup"); }} />
  </>;
}
