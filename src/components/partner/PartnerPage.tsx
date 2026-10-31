"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, CheckCircledIcon, DashboardIcon, LockClosedIcon, PersonIcon, StarIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import "./partner.css";

const benefits = [
  { icon: <StarIcon />, title: "สิทธิพิเศษสำหรับตัวแทน", text: "รับส่วนลดและสิทธิประโยชน์ที่เหมาะกับการจำหน่ายต่อ" },
  { icon: <DashboardIcon />, title: "เกมและบัตรครบในที่เดียว", text: "รวมเกมยอดนิยมและบัตรเติมเงินไว้ให้เลือกจำหน่าย" },
  { icon: <LockClosedIcon />, title: "เติมปลอดภัยทุกออเดอร์", text: "ทีมงานตรวจสอบทุกคำสั่งซื้อเพื่อความมั่นใจของลูกค้าคุณ" },
  { icon: <PersonIcon />, title: "ทีมงานคอยดูแล", text: "มีทีมงานช่วยตอบคำถามและให้คำแนะนำตั้งแต่เริ่มต้น" },
];

const steps = [
  { title: "กรอกใบสมัคร", text: "แนะนำตัวและช่องทางจำหน่ายของคุณ" },
  { title: "ทีมงานติดต่อกลับ", text: "ตรวจสอบข้อมูลและติดต่อผ่านช่องทางที่ให้ไว้" },
  { title: "รับข้อมูลโครงการ", text: "แจ้งสิทธิประโยชน์ รายการสินค้า และเงื่อนไข" },
  { title: "เริ่มจำหน่าย", text: "เตรียมความพร้อมและเริ่มสั่งซื้อได้ทันที" },
];

const channels = ["ร้านค้าออนไลน์", "โซเชียลมีเดีย", "หน้าร้าน", "ช่องทางอื่น ๆ"];

export default function PartnerPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="partner" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container partner-page" id="top">
      <nav className="partner-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("พาร์ทเนอร์")}</span></nav>
      <PageHero id="partner-title" eyebrow="THX2PAY PARTNERS" title="พาร์ทเนอร์" accent="เติบโตไปด้วยกัน" description="ร่วมเป็นตัวแทนจำหน่ายกับ THX2PAY และเติบโตไปด้วยกัน" image="/images/hero-lion.webp" imageAlt="มาสคอตสิงโต THX2PAY" cta={{ label: "สมัครตัวแทนจำหน่าย", href: "/partner/apply" }} />

      <section className="partner-block" aria-labelledby="partner-benefits-title">
        <div className="partner-head"><span className="partner-kicker">WHY THX2PAY</span><h2 id="partner-benefits-title">{t("ทำไมต้องเป็นตัวแทนกับเรา")}</h2></div>
        <div className="partner-benefits">{benefits.map(item => <article key={item.title}><span className="partner-icon">{item.icon}</span><h3>{t(item.title)}</h3><p>{t(item.text)}</p></article>)}</div>
      </section>

      <section className="partner-block" aria-labelledby="partner-steps-title">
        <div className="partner-head"><span className="partner-kicker">HOW IT WORKS</span><h2 id="partner-steps-title">{t("เริ่มต้นง่าย ๆ ใน 4 ขั้นตอน")}</h2></div>
        <ol className="partner-steps">{steps.map((step, index) => <li key={step.title}><span className="partner-step-no">{index + 1}</span><div><h3>{t(step.title)}</h3><p>{t(step.text)}</p></div></li>)}</ol>
      </section>

      <section className="partner-fit" aria-labelledby="partner-fit-title">
        <div><span className="partner-kicker">WHO CAN JOIN</span><h2 id="partner-fit-title">{t("เหมาะกับผู้จำหน่ายหลายรูปแบบ")}</h2><p>{t("ไม่ว่าคุณขายผ่านช่องทางไหน ก็สมัครเป็นตัวแทนได้")}</p></div>
        <ul>{channels.map(channel => <li key={channel}><CheckCircledIcon />{t(channel)}</li>)}</ul>
        <Link href="/partner/apply" className="pill">{t("สมัครตัวแทนจำหน่าย")}<ArrowRightIcon /></Link>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
