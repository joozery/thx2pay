"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { EnvelopeClosedIcon, ClockIcon, QuestionMarkCircledIcon, PersonIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import InfoShell from "./InfoShell";

const supportEmail = "support@thx2pay.com";
const topics = ["สอบถามคำสั่งซื้อ", "ปัญหาการเติมเกม", "บัญชีและการเข้าสู่ระบบ", "อื่น ๆ"];

// No backend yet: the form opens the customer's email app with the message pre-filled.
export default function ContactPage() {
  const { t } = useI18n();
  const [sent, setSent] = useState(false);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = `[${t(String(data.get("topic")))}] ${String(data.get("name"))}`;
    const order = String(data.get("order") || "").trim();
    const body = `${String(data.get("message"))}\n\n${t("ชื่อ")}: ${String(data.get("name"))}\n${t("อีเมล")}: ${String(data.get("email"))}${order ? `\n${t("หมายเลขคำสั่งซื้อ")}: ${order}` : ""}`;
    window.location.href = `mailto:${supportEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSent(true);
  }

  return <InfoShell crumb="ติดต่อเรา">
    <section className="info-hero">
      <span className="info-hero-icon" aria-hidden="true"><EnvelopeClosedIcon /></span>
      <span className="info-eyebrow">CONTACT US</span>
      <h1>{t("ติดต่อเรา")}</h1>
      <p>{t("มีคำถามเรื่องคำสั่งซื้อ การเติมเกม หรือบัญชีของคุณ ทีมงาน THX2PAY พร้อมช่วยเหลือคุณ")}</p>
    </section>

    <div className="contact-layout">
      <aside className="contact-channels" aria-labelledby="contact-channels-title">
        <h2 id="contact-channels-title" className="info-sr">{t("ช่องทางติดต่อ")}</h2>
        <a className="info-card contact-channel" href={`mailto:${supportEmail}`}><span className="info-card-icon" aria-hidden="true"><EnvelopeClosedIcon /></span><div><h3>{t("อีเมล")}</h3><p>{supportEmail}</p></div></a>
        <div className="info-card contact-channel"><span className="info-card-icon" aria-hidden="true"><ClockIcon /></span><div><h3>{t("เวลาให้บริการ")}</h3><p>{t("ทุกวัน 09:00 – 24:00 น.")}</p></div></div>
        <Link className="info-card contact-channel" href="/help"><span className="info-card-icon" aria-hidden="true"><QuestionMarkCircledIcon /></span><div><h3>{t("ศูนย์ช่วยเหลือ")}</h3><p>{t("คำถามที่พบบ่อยและวิธีหา UID")}</p></div></Link>
      </aside>

      <section className="info-card contact-form-card" aria-labelledby="contact-form-title">
        <h2 id="contact-form-title">{t("ส่งข้อความถึงทีมงาน")}</h2>
        <p className="contact-form-note">{t("เมื่อกดส่ง ระบบจะเปิดแอปอีเมลพร้อมข้อความที่กรอกไว้ โปรดกดส่งในแอปอีเมลอีกครั้ง")}</p>
        <form className="contact-form" onSubmit={submit}>
          <div className="contact-form-grid">
            <label><span>{t("ชื่อ")}</span><input name="name" required autoComplete="name" placeholder={t("ชื่อของคุณ")} /></label>
            <label><span>{t("อีเมล")}</span><input name="email" type="email" required autoComplete="email" placeholder="you@example.com" /></label>
          </div>
          <div className="contact-form-grid">
            <label><span>{t("หัวข้อ")}</span><select name="topic" defaultValue={topics[0]}>{topics.map(topic => <option key={topic} value={topic}>{t(topic)}</option>)}</select></label>
            <label><span>{t("หมายเลขคำสั่งซื้อ")} <small>({t("ถ้ามี")})</small></span><input name="order" placeholder="เช่น TX-000123" /></label>
          </div>
          <label><span>{t("ข้อความ")}</span><textarea name="message" required rows={5} placeholder={t("เล่ารายละเอียดที่ต้องการให้เราช่วย")} /></label>
          <button className="pill contact-submit" type="submit">{t("ส่งข้อความ")}</button>
          {sent && <p className="contact-sent" role="status"><CheckCircledIcon aria-hidden="true" />{t("เปิดแอปอีเมลแล้ว หากไม่เปิด ส่งอีเมลถึง support@thx2pay.com ได้โดยตรง")}</p>}
        </form>
      </section>
    </div>
  </InfoShell>;
}
