"use client";

import { useEffect, useRef, useState, type ClipboardEvent, type FormEvent, type KeyboardEvent } from "react";
import Link from "next/link";
import { ArrowLeftIcon, CheckIcon, CheckCircledIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import AuthLayout from "./auth/AuthLayout";
import PasswordField, { passwordRules } from "./auth/PasswordField";

type Step = "email" | "code" | "reset" | "done";
const steps: Step[] = ["email", "code", "reset", "done"];
const stepLabels = ["อีเมล", "รหัสยืนยัน", "รหัสใหม่", "เสร็จสิ้น"];
const CODE_LENGTH = 6;
const RESEND_SECONDS = 60;

function maskEmail(email: string) {
  const [name, domain] = email.split("@");
  if (!domain) return email;
  return `${name.slice(0, 2)}${"•".repeat(Math.max(1, name.length - 2))}@${domain}`;
}

// Prototype flow: no email is sent yet. Any 6-digit code is accepted so the screens can be reviewed.
// Connect `sendCode`, `verifyCode` and `resetPassword` to the backend when it exists.
export default function ForgotPasswordFlow() {
  const { t } = useI18n();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState<string[]>(Array(CODE_LENGTH).fill(""));
  const [cooldown, setCooldown] = useState(0);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const codeRefs = useRef<(HTMLInputElement | null)[]>([]);
  const current = steps.indexOf(step);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = window.setTimeout(() => setCooldown(value => value - 1), 1000);
    return () => window.clearTimeout(timer);
  }, [cooldown]);

  useEffect(() => { if (step === "code") codeRefs.current[0]?.focus(); }, [step]);

  function sendCode(event?: FormEvent<HTMLFormElement>) {
    event?.preventDefault();
    if (event && !event.currentTarget.reportValidity()) return;
    setCode(Array(CODE_LENGTH).fill(""));
    setError("");
    setCooldown(RESEND_SECONDS);
    setStep("code");
  }

  function setDigit(index: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    setCode(prev => prev.map((d, i) => i === index ? digit : d));
    setError("");
    if (digit && index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
  }

  function onCodeKey(index: number, event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Backspace" && !code[index] && index > 0) codeRefs.current[index - 1]?.focus();
    if (event.key === "ArrowLeft" && index > 0) codeRefs.current[index - 1]?.focus();
    if (event.key === "ArrowRight" && index < CODE_LENGTH - 1) codeRefs.current[index + 1]?.focus();
  }

  function onCodePaste(event: ClipboardEvent<HTMLInputElement>) {
    const digits = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, CODE_LENGTH);
    if (!digits) return;
    event.preventDefault();
    setCode(Array.from({ length: CODE_LENGTH }, (_, i) => digits[i] ?? ""));
    codeRefs.current[Math.min(digits.length, CODE_LENGTH - 1)]?.focus();
  }

  function verifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (code.join("").length !== CODE_LENGTH) return setError("กรอกรหัสยืนยันให้ครบ 6 หลัก");
    setStep("reset");
  }

  function resetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!passwordRules.every(rule => rule.test(password))) return setError("รหัสผ่านยังไม่ตรงตามเงื่อนไข");
    if (password !== confirm) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
    setStep("done");
  }

  return <AuthLayout crumb="ลืมรหัสผ่าน" title="ลืมรหัสผ่าน" intro="ไม่ต้องกังวล ตั้งรหัสผ่านใหม่ได้ใน 3 ขั้นตอน">
    <ol className="auth-steps" aria-label={t("ขั้นตอน")}>{stepLabels.map((label, index) => <li key={label} className={index < current ? "done" : index === current ? "current" : ""} aria-current={index === current ? "step" : undefined}><span>{index < current ? <CheckIcon /> : index + 1}</span>{t(label)}</li>)}</ol>

    {step === "email" && <>
      <div className="auth-head"><h1>{t("ลืมรหัสผ่าน?")}</h1><p>{t("กรอกอีเมลที่ใช้สมัคร เราจะส่งรหัสยืนยัน 6 หลักไปให้")}</p></div>
      <form className="auth-form" onSubmit={sendCode}>
        <label className="auth-field"><span>{t("อีเมล")}</span><span className="auth-input"><EnvelopeClosedIcon aria-hidden="true" /><input type="email" name="email" autoComplete="email" required placeholder="name@example.com" value={email} onChange={event => setEmail(event.target.value)} /></span></label>
        <button className="auth-submit" type="submit">{t("ส่งรหัสยืนยัน")}</button>
      </form>
    </>}

    {step === "code" && <>
      <div className="auth-head"><h1>{t("กรอกรหัสยืนยัน")}</h1><p>{t("เราส่งรหัส 6 หลักไปที่")} <strong>{maskEmail(email)}</strong></p></div>
      <form className="auth-form" onSubmit={verifyCode}>
        <div className="auth-code" role="group" aria-label={t("รหัสยืนยัน 6 หลัก")}>
          {code.map((digit, index) => <input key={index} ref={el => { codeRefs.current[index] = el; }} value={digit} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} aria-label={`${t("หลักที่")} ${index + 1}`} onChange={event => setDigit(index, event.target.value)} onKeyDown={event => onCodeKey(index, event)} onPaste={onCodePaste} className={digit ? "filled" : ""} />)}
        </div>
        {error && <p className="auth-hint error" role="alert">{t(error)}</p>}
        <p className="auth-demo">{t("โหมดทดลอง: ยังไม่ได้ส่งอีเมลจริง กรอกตัวเลข 6 หลักใดก็ได้")}</p>
        <button className="auth-submit" type="submit">{t("ยืนยันรหัส")}</button>
        <div className="auth-row center">
          {cooldown > 0 ? <span className="auth-muted">{t("ส่งรหัสใหม่ได้ใน {{seconds}} วินาที", { seconds: cooldown })}</span> : <button type="button" className="auth-link" onClick={() => sendCode()}>{t("ส่งรหัสอีกครั้ง")}</button>}
          <button type="button" className="auth-link muted" onClick={() => { setStep("email"); setError(""); }}>{t("เปลี่ยนอีเมล")}</button>
        </div>
      </form>
    </>}

    {step === "reset" && <>
      <div className="auth-head"><h1>{t("ตั้งรหัสผ่านใหม่")}</h1><p>{t("ตั้งรหัสผ่านที่ไม่ซ้ำกับรหัสเดิม")}</p></div>
      <form className="auth-form" onSubmit={resetPassword}>
        <PasswordField label="รหัสผ่านใหม่" name="new-password" autoComplete="new-password" required maxLength={128} value={password} onChange={event => { setPassword(event.target.value); setError(""); }} aria-describedby="reset-rules" />
        <ul className="auth-rules" id="reset-rules">{passwordRules.map(rule => <li key={rule.label} className={rule.test(password) ? "ok" : ""}><CheckIcon aria-hidden="true" />{t(rule.label)}</li>)}</ul>
        <PasswordField label="ยืนยันรหัสผ่านใหม่" name="confirm-password" autoComplete="new-password" required maxLength={128} value={confirm} onChange={event => { setConfirm(event.target.value); setError(""); }} aria-invalid={confirm.length > 0 && confirm !== password} />
        {error && <p className="auth-hint error" role="alert">{t(error)}</p>}
        <button className="auth-submit" type="submit">{t("บันทึกรหัสผ่านใหม่")}</button>
      </form>
    </>}

    {step === "done" && <div className="auth-done" role="status">
      <span className="auth-done-icon" aria-hidden="true"><CheckCircledIcon /></span>
      <h1>{t("ตั้งรหัสผ่านใหม่เรียบร้อย")}</h1>
      <p>{t("ใช้รหัสผ่านใหม่เพื่อเข้าสู่ระบบได้ทันที")}</p>
      <Link className="auth-submit" href="/login">{t("ไปหน้าเข้าสู่ระบบ")}</Link>
    </div>}

    {step !== "done" && <p className="auth-switch"><Link href="/login" className="auth-back"><ArrowLeftIcon aria-hidden="true" />{t("กลับไปหน้าเข้าสู่ระบบ")}</Link></p>}
  </AuthLayout>;
}
