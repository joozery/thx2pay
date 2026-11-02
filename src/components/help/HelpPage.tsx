"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRightIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  MagnifyingGlassIcon,
  PersonIcon,
  QuestionMarkCircledIcon,
  RocketIcon,
  ClockIcon,
} from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import { contactChannels, serviceHours } from "@/components/home/contactChannels";
import ChannelIcon from "@/components/home/ChannelIcon";
import "./help.css";
import "./help-channels.css";

const topics = [
  {
    title: "เติมเกมและแพ็กเกจ",
    description: "เลือกเกมที่สนใจและสอบถามแพ็กเกจก่อนทำรายการ",
    href: "/topup",
    icon: RocketIcon,
    action: "ดูเกมทั้งหมด",
  },
  {
    title: "UID และ Player ID",
    description: "ดูวิธีค้นหาไอดีในเกมและตรวจสอบข้อมูลให้ถูกต้อง",
    href: "#faq-uid",
    icon: PersonIcon,
    action: "อ่านวิธีตรวจสอบ",
  },
  {
    title: "บัญชีและการเข้าสู่ระบบ",
    description: "ดูสถานะระบบสมาชิกและวิธีขอความช่วยเหลือ",
    href: "#faq-account",
    icon: QuestionMarkCircledIcon,
    action: "ดูคำตอบ",
  },
];

const questions = [
  {
    id: "faq-order",
    question: "จะเลือกเกมและแพ็กเกจอย่างไร?",
    answer: "ไปที่หน้าเติมเกม เลือกเกมที่สนใจ แล้วสอบถามแพ็กเกจและรายละเอียดกับทีมงานก่อนทำรายการ",
  },
  {
    id: "faq-uid",
    question: "จะหา UID หรือ Player ID ได้ที่ไหน?",
    answer: "เปิดหน้าโปรไฟล์ในเกม แล้วคัดลอก UID หรือ Player ID ตามที่เกมแสดง ตรวจสอบตัวเลขและเซิร์ฟเวอร์ให้ถูกต้องก่อนส่งให้ทีมงาน",
  },
  {
    id: "faq-payment",
    question: "ตอนนี้สามารถชำระเงินบนเว็บไซต์ได้หรือไม่?",
    answer: "ระบบชำระเงินบนเว็บไซต์ยังไม่เปิดใช้งาน กรุณาสอบถามช่องทางสั่งซื้อและชำระเงินกับทีมงานก่อนทำรายการ",
  },
  {
    id: "faq-account",
    question: "ทำไมยังเข้าสู่ระบบไม่ได้?",
    answer: "ระบบสมาชิกยังไม่เชื่อมต่อ หากต้องการความช่วยเหลือเกี่ยวกับบัญชี กรุณาติดต่อทีมงานทางอีเมล",
  },
  {
    id: "faq-problem",
    question: "หากมีปัญหาเกี่ยวกับรายการต้องทำอย่างไร?",
    answer: "ส่งอีเมลถึงทีมงานพร้อมชื่อเกม รายละเอียดปัญหา และหมายเลขคำสั่งซื้อ (ถ้ามี) เพื่อให้ตรวจสอบได้ตรงจุด",
  },
];

export default function HelpPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [modal, setModal] = useState("");
  const visibleQuestions = questions.filter(item => `${t(item.question)} ${t(item.answer)}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="help" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container help-page" id="top">
      <nav className="help-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("ศูนย์ช่วยเหลือ")}</span></nav>

      <PageHero id="help-title" eyebrow="THX2PAY SUPPORT" title="ช่วยเหลือ" accent="พร้อมดูแลคุณ" description="รวมคำตอบที่พบบ่อยและช่องทางติดต่อทีมงาน THX2PAY" image="/images/hero-games-refined.webp" imageAlt="ภาพเกมแฟนตาซีและไซไฟ" cta={{ label: "สอบถามทีมงาน", href: "mailto:support@thx2pay.com" }} />

      <section className="help-topics" aria-labelledby="help-topics-title">
        <div className="help-section-heading"><span className="help-section-kicker">01 / {t("เริ่มต้นที่นี่")}</span><h2 id="help-topics-title">{t("คุณต้องการความช่วยเหลือเรื่องใด?")}</h2><p>{t("เลือกหัวข้อที่ตรงกับสิ่งที่คุณกำลังหา")}</p></div>
        <div className="help-topic-grid">{topics.map(topic => {
          const Icon = topic.icon;
          return <Link className="help-topic-card" href={topic.href} key={topic.title} onClick={() => {
            if (topic.href.startsWith("#")) {
              const answer = document.getElementById(topic.href.slice(1));
              if (answer instanceof HTMLDetailsElement) answer.open = true;
            }
          }}>
            <span className="help-topic-icon"><Icon /></span>
            <h3>{t(topic.title)}</h3>
            <p>{t(topic.description)}</p>
            <span className="help-topic-action">{t(topic.action)}<ArrowRightIcon /></span>
          </Link>;
        })}</div>
      </section>

      <section className="help-faq-section" id="help-questions" aria-labelledby="help-faq-title">
        <div className="help-faq-intro"><span className="help-section-kicker">02 / FAQ</span><h2 id="help-faq-title">{t("คำถามที่พบบ่อย")}</h2><p>{t("รวมคำตอบเกี่ยวกับการเติมเกม บัญชี และการติดต่อทีมงาน")}</p></div>
        <div className="help-faq-content">
          <label className="help-question-search"><MagnifyingGlassIcon /><span className="sr-only">{t("ค้นหาคำถาม")}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("ค้นหาคำถาม เช่น UID, ชำระเงิน, บัญชี")} /></label>
          <div className="help-question-list">{visibleQuestions.length ? visibleQuestions.map(item => <details id={item.id} key={item.id} className="help-question"><summary><span>{t(item.question)}</span><ChevronDownIcon /></summary><p>{t(item.answer)}</p></details>) : <div className="help-no-results"><strong>{t("ไม่พบคำตอบที่ค้นหา")}</strong><p>{t("ลองใช้คำค้นอื่น หรือส่งคำถามถึงทีมงาน")}</p></div>}</div>
        </div>
      </section>

      <section className="help-channels" id="help-contact" aria-labelledby="help-channels-title">
        <div className="help-section-heading"><span className="help-section-kicker">03 / {t("ติดต่อเรา")}</span><h2 id="help-channels-title">{t("ช่องทางติดต่ออื่น ๆ")}</h2><p>{t("เลือกช่องทางที่สะดวก ทีมงานพร้อมช่วยเหลือ")} · <ClockIcon aria-hidden="true" className="help-hours-icon" />{t(serviceHours)}</p></div>
        <ul className="help-channel-grid">{contactChannels.map(channel => {
          const ready = Boolean(channel.href);
          const body = <>
            <ChannelIcon channel={channel} />
            <span className="help-channel-copy">
              <h3>{t(channel.name)}{channel.badge && <span className="help-channel-badge">{t(channel.badge)}</span>}</h3>
              <span className="help-channel-handle">{channel.handle}</span>
              <span className="help-channel-desc">{t(channel.description)}</span>
            </span>
            <span className={`help-channel-action${ready ? "" : " soon"}`}>{t(ready ? channel.action : "เร็ว ๆ นี้")}{ready && <ArrowRightIcon aria-hidden="true" />}</span>
          </>;
          return <li key={channel.id} className={`help-channel${channel.id === "line" ? " featured" : ""}`} style={{ "--channel": channel.color } as React.CSSProperties}>
            {ready ? <a href={channel.href!} target={channel.href!.startsWith("http") ? "_blank" : undefined} rel="noopener noreferrer">{body}</a> : <div aria-disabled="true">{body}</div>}
          </li>;
        })}</ul>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
