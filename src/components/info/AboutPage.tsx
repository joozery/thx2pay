"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRightIcon, LightningBoltIcon, LockClosedIcon, ChatBubbleIcon, IdCardIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import InfoShell from "./InfoShell";

const values = [
  { icon: LightningBoltIcon, title: "รวดเร็ว", text: "ใส่ UID เลือกแพ็กเกจ แล้วไอเทมเข้าเกมได้ทันทีโดยไม่ต้องรอแอดมิน" },
  { icon: LockClosedIcon, title: "ปลอดภัย", text: "ไม่ต้องให้รหัสผ่านเกม และชำระเงินผ่านช่องทางที่ได้มาตรฐาน" },
  { icon: IdCardIcon, title: "ครบในที่เดียว", text: "เติมเกม บัตรเติมเงิน โค้ดเกม และแอพพรีเมียม รวมไว้ในเว็บเดียว" },
  { icon: ChatBubbleIcon, title: "ดูแลจริง", text: "ทีมงานพร้อมช่วยเหลือทุกวัน 09:00 – 24:00 น." },
];

const services = [
  { title: "เติมเกม", text: "เติมเกมยอดนิยมด้วย UID", href: "/topup" },
  { title: "บัตรเติมเงิน", text: "บัตรเติมเกมและบัตรของขวัญ", href: "/cards" },
  { title: "พรีเมียม", text: "แอพดูหนัง ฟังเพลง และทำงาน", href: "/premium" },
];

export default function AboutPage() {
  const { t } = useI18n();
  return <InfoShell crumb="เกี่ยวกับเรา">
    <section className="about-hero">
      <div className="about-hero-copy">
        <span className="info-eyebrow">ABOUT THX2PAY</span>
        <h1>{t("เติมความสนุก")}<br /><span>{t("ให้ทุกเกมที่คุณรัก")}</span></h1>
        <p>{t("THX2PAY คือแพลตฟอร์มเติมเกมและสินค้าดิจิทัลที่ออกแบบมาให้ง่าย เร็ว และปลอดภัย เพื่อให้คุณใช้เวลากับการเล่นมากกว่าการรอ")}</p>
        <div className="about-hero-actions"><Link className="pill" href="/topup">{t("เริ่มเติมเกม")}<ArrowRightIcon /></Link><Link className="info-ghost-button" href="/contact">{t("ติดต่อเรา")}</Link></div>
      </div>
      <div className="about-hero-art"><Image src="/images/mascot-lion.webp" alt={t("มาสคอตสิงโต THX2PAY")} fill sizes="(max-width: 760px) 60vw, 380px" style={{ objectFit: "cover" }} loading="eager" fetchPriority="high" /></div>
    </section>

    <section className="info-section" aria-labelledby="about-values-title">
      <div className="info-section-head"><span className="info-eyebrow">WHY THX2PAY</span><h2 id="about-values-title">{t("สิ่งที่เรายึดมั่น")}</h2></div>
      <div className="about-values">{values.map(({ icon: Icon, title, text }) => <article key={title} className="info-card"><span className="info-card-icon" aria-hidden="true"><Icon /></span><h3>{t(title)}</h3><p>{t(text)}</p></article>)}</div>
    </section>

    <section className="info-section" aria-labelledby="about-services-title">
      <div className="info-section-head"><span className="info-eyebrow">OUR SERVICES</span><h2 id="about-services-title">{t("บริการของเรา")}</h2></div>
      <div className="about-services">{services.map(service => <Link key={service.href} href={service.href} className="info-card about-service"><div><h3>{t(service.title)}</h3><p>{t(service.text)}</p></div><ArrowRightIcon aria-hidden="true" /></Link>)}</div>
    </section>
  </InfoShell>;
}
