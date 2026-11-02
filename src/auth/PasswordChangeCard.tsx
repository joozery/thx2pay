"use client";

import { useState, type FormEvent } from "react";
import { Dialog } from "radix-ui";
import { ArrowLeftIcon, ArrowRightIcon, CheckIcon, Cross2Icon, EyeOpenIcon, EyeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";

type Step = "form" | "review" | "success";

export default function PasswordChangeCard({ email }: { email: string }) {
  const { t } = useI18n();
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<Step>("form");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const longEnough = password.length >= 8;
  const matches = !!confirmation && password === confirmation;

  function reset() {
    setPassword(""); setConfirmation(""); setError(""); setShow(false); setStep("form");
  }
  function changeOpen(next: boolean) {
    reset(); setOpen(next);
  }
  function review(event: FormEvent) {
    event.preventDefault();
    if (!longEnough) { setError("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร"); return; }
    if (!matches) { setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน"); return; }
    setError(""); setShow(false); setStep("review");
  }
  function finishDemo() {
    // Demo only: never persist passwords or claim that real credentials changed.
    setPassword(""); setConfirmation(""); setStep("success");
  }

  return <section className="member-card">
    <div className="member-card-head"><span className="member-icon green"><LockClosedIcon /></span><div><h2>{t("ความปลอดภัย")}</h2><p>{t("ดูแลการเข้าถึงบัญชีของคุณ")}</p></div></div>
    <div className="member-security-row"><div><b>{t("รหัสผ่าน")}</b><p>{t("จัดการรหัสผ่านสำหรับบัญชีของคุณ")}</p></div><button type="button" className="member-button member-password-trigger" onClick={() => changeOpen(true)}>{t("เปลี่ยนรหัสผ่าน")}</button></div>
    <p className="member-info-note">{t("ทดลองขั้นตอนเปลี่ยนรหัสผ่าน โดยไม่เปลี่ยนหรือบันทึกรหัสผ่านจริง")}</p>
    <Dialog.Root open={open} onOpenChange={changeOpen}><Dialog.Portal><Dialog.Overlay className="member-password-overlay" /><Dialog.Content className="member-password-dialog">
      <div className="member-password-heading"><span className="member-icon green"><LockClosedIcon /></span><span className="member-password-demo">{t("โหมดทดสอบ")}</span></div>
      <Dialog.Title>{t(step === "success" ? "ขั้นตอนตัวอย่างเสร็จสมบูรณ์" : step === "review" ? "ยืนยันการเปลี่ยนรหัสผ่าน" : "เปลี่ยนรหัสผ่าน")}</Dialog.Title>
      <Dialog.Description>{t("ทดลองขั้นตอนเปลี่ยนรหัสผ่าน โดยไม่เปลี่ยนหรือบันทึกรหัสผ่านจริง")}</Dialog.Description>
      <Dialog.Close className="member-password-close" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
      <ol className="member-password-steps" aria-label={t("ขั้นตอนเปลี่ยนรหัสผ่าน")}>{["กรอกรหัสผ่าน", "ยืนยัน", "สำเร็จ"].map((label,index) => <li key={label} className={index <= ["form","review","success"].indexOf(step) ? "current" : ""}><span>{index+1}</span>{t(label)}</li>)}</ol>
      {step === "form" && <form className="acct-form" onSubmit={review} noValidate>
        <label>{t("รหัสผ่านใหม่")}<span className="member-password-input"><input type={show ? "text" : "password"} name="new-password" autoComplete="new-password" minLength={8} maxLength={128} required value={password} onChange={event => {setPassword(event.target.value);setError("");}} aria-invalid={!!error && !longEnough} aria-describedby="password-rules password-error" /><button type="button" aria-label={t(show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน")} aria-pressed={show} onClick={() => setShow(value => !value)}>{show ? <EyeClosedIcon /> : <EyeOpenIcon />}</button></span></label>
        <label>{t("ยืนยันรหัสผ่านใหม่")}<input type={show ? "text" : "password"} name="confirm-password" autoComplete="new-password" maxLength={128} required value={confirmation} onChange={event => {setConfirmation(event.target.value);setError("");}} aria-invalid={!!error && !matches} aria-describedby="password-rules password-error" /></label>
        <ul className="member-password-rules" id="password-rules"><li className={longEnough ? "valid" : ""}><CheckIcon />{t("รหัสผ่านต้องมีอย่างน้อย 8 ตัวอักษร")}</li><li className={matches ? "valid" : ""}><CheckIcon />{t("รหัสผ่านทั้งสองช่องตรงกัน")}</li></ul>
        <p className="member-password-error" role="alert" id="password-error">{t(error)}</p>
        <button type="submit" className="member-button">{t("ดำเนินการต่อ")}<ArrowRightIcon /></button>
      </form>}
      {step === "review" && <div className="member-password-review"><dl><div><dt>{t("อีเมล")}</dt><dd>{email}</dd></div><div><dt>{t("รหัสผ่านใหม่")}</dt><dd>••••••••</dd></div><div><dt>{t("สถานะ")}</dt><dd><CheckIcon />{t("ผ่านการตรวจสอบรูปแบบ")}</dd></div></dl><div className="member-password-actions"><button type="button" onClick={() => setStep("form")}><ArrowLeftIcon />{t("ย้อนกลับ")}</button><button type="button" className="member-button" onClick={finishDemo}>{t("ยืนยันขั้นตอนตัวอย่าง")}<CheckIcon /></button></div></div>}
      {step === "success" && <div className="member-password-success"><span><CheckIcon /></span><h3>{t("ทดลองเปลี่ยนรหัสผ่านสำเร็จ")}</h3><p>{t("รหัสผ่านที่กรอกถูกล้างแล้ว ไม่มีการเปลี่ยนข้อมูลเข้าสู่ระบบจริง")}</p><Dialog.Close className="member-button">{t("กลับไปหน้าบัญชี")}</Dialog.Close></div>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </section>;
}
