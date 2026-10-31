"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { ChevronRightIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "./FlowShell";

type Application = { name: string; email: string; contact: string; channel: string; message: string };
const initial: Application = { name: "", email: "", contact: "", channel: "", message: "" };

export default function PartnerApplyFlow() {
  const { t } = useI18n();
  const [form, setForm] = useState<Application>(initial);
  const [review, setReview] = useState(false);
  const body = `สมัครตัวแทนจำหน่าย THX2PAY\n\nชื่อ: ${form.name}\nอีเมล: ${form.email}\nช่องทางติดต่อ: ${form.contact}\nช่องทางจำหน่าย: ${form.channel}\nรายละเอียดเพิ่มเติม: ${form.message || "-"}`;
  const mailto = `mailto:support@thx2pay.com?subject=${encodeURIComponent("สมัครตัวแทนจำหน่าย THX2PAY")}&body=${encodeURIComponent(body)}`;

  function update(field: keyof Application, value: string) {
    setForm(current => ({ ...current, [field]: value }));
    setReview(false);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    setReview(true);
  }

  return <FlowShell>
    <nav className="flow-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><Link href="/partner">{t("พาร์ทเนอร์")}</Link><ChevronRightIcon /><span>{t("สมัครตัวแทนจำหน่าย")}</span></nav>
    <div className="flow-heading"><span className="flow-kicker">THX2PAY PARTNERS</span><h1>{t("สมัครตัวแทนจำหน่าย")}</h1><p>{t("แนะนำตัวและช่องทางจำหน่ายของคุณ เพื่อให้ทีมงานติดต่อกลับ")}</p></div>
    <div className="flow-steps" aria-label={t("ขั้นตอนสมัครตัวแทน")}><span className={review ? "done" : "current"}>1 · {t("กรอกข้อมูล")}</span><span className={review ? "current" : ""}>2 · {t("ตรวจสอบข้อมูล")}</span><span>3 · {t("ส่งอีเมล")}</span></div>
    <div className="flow-layout">
      <section className="flow-panel" aria-labelledby="partner-form-title"><h2 id="partner-form-title">{t(review ? "ตรวจสอบข้อมูล" : "ข้อมูลผู้สมัคร")}</h2><p>{t("กรอกข้อมูลที่ทีมงานใช้ติดต่อกลับ")}</p>
        <form className="flow-form" onSubmit={submit}>
          <label>{t("ชื่อผู้ติดต่อ")}<input required maxLength={100} autoComplete="name" value={form.name} onChange={event => update("name", event.target.value)} placeholder={t("ชื่อและนามสกุล")} /></label>
          <label>{t("อีเมล")}<input required type="email" maxLength={160} autoComplete="email" value={form.email} onChange={event => update("email", event.target.value)} placeholder="name@example.com" /></label>
          <label>{t("เบอร์โทรหรือ LINE ID")}<input required maxLength={100} value={form.contact} onChange={event => update("contact", event.target.value)} placeholder={t("ช่องทางที่สะดวกให้ติดต่อกลับ")} /></label>
          <label>{t("ช่องทางจำหน่าย")}<select required value={form.channel} onChange={event => update("channel", event.target.value)}><option value="">{t("เลือกช่องทาง")}</option><option value="Online store">{t("ร้านค้าออนไลน์")}</option><option value="Social media">{t("โซเชียลมีเดีย")}</option><option value="Physical store">{t("หน้าร้าน")}</option><option value="Other">{t("อื่น ๆ")}</option></select></label>
          <label>{t("รายละเอียดเพิ่มเติม")}<textarea maxLength={1000} rows={4} value={form.message} onChange={event => update("message", event.target.value)} placeholder={t("เล่ารูปแบบธุรกิจหรือสินค้าที่สนใจ")} /></label>
          <button className="pill flow-submit" type="submit">{t("ตรวจสอบข้อมูล")}</button>
        </form>
        {review && <div className="flow-notice" role="status"><strong>{t("ข้อมูลพร้อมส่ง")}</strong><p>{t("ระบบจะเปิดแอปอีเมลพร้อมรายละเอียดที่กรอก โปรดกดส่งในแอปอีเมลเพื่อส่งใบสมัคร")}</p><a className="pill" href={mailto}><EnvelopeClosedIcon />{t("เปิดอีเมลเพื่อส่งใบสมัคร")}</a></div>}
      </section>
      <aside className="flow-aside"><h2>{t("ขั้นตอนถัดไป")}</h2><p>{t("หลังส่งอีเมล ทีมงานจะตรวจสอบข้อมูลและติดต่อกลับผ่านช่องทางที่ให้ไว้")}</p><p>{t("สอบถามสิทธิประโยชน์และเงื่อนไขการเป็นตัวแทนได้โดยตรง")}</p><Link href="/partner">{t("ดูหน้าพาร์ทเนอร์")} <ChevronRightIcon /></Link></aside>
    </div>
  </FlowShell>;
}
