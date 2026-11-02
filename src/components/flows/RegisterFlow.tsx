"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { CheckIcon, EnvelopeClosedIcon, PersonIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/useI18n";
import AuthLayout from "./auth/AuthLayout";
import PasswordField, { passwordRules } from "./auth/PasswordField";
import SocialLogin from "./auth/SocialLogin";

export default function RegisterFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const rulesOk = passwordRules.every(rule => rule.test(password));
  const matches = confirm.length > 0 && confirm === password;

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    if (!rulesOk) return setError("รหัสผ่านยังไม่ตรงตามเงื่อนไข");
    if (!matches) return setError("รหัสผ่านทั้งสองช่องไม่ตรงกัน");
    const data = new FormData(form);
    login(String(data.get("email")), String(data.get("name")));
    router.push("/");
  }

  return <AuthLayout crumb="สมัครสมาชิก" title="สมัครสมาชิก" intro="สมัครฟรี บันทึก UID ไว้เติมครั้งต่อไป และติดตามทุกคำสั่งซื้อได้ในที่เดียว">
    <div className="auth-head"><h1>{t("สร้างบัญชีใหม่")}</h1><p>{t("ใช้เวลาไม่ถึง 1 นาที")}</p></div>
    <form onSubmit={submit} className="auth-form" noValidate={false}>
      <label className="auth-field"><span>{t("ชื่อที่แสดง")}</span><span className="auth-input"><PersonIcon aria-hidden="true" /><input name="name" autoComplete="nickname" required maxLength={40} placeholder={t("ชื่อของคุณ")} /></span></label>
      <label className="auth-field"><span>{t("อีเมล")}</span><span className="auth-input"><EnvelopeClosedIcon aria-hidden="true" /><input type="email" name="email" autoComplete="email" required placeholder="name@example.com" /></span></label>
      <PasswordField label="รหัสผ่าน" name="password" autoComplete="new-password" required maxLength={128} value={password} onChange={event => { setPassword(event.target.value); setError(""); }} aria-describedby="register-rules" />
      <ul className="auth-rules" id="register-rules">{passwordRules.map(rule => <li key={rule.label} className={rule.test(password) ? "ok" : ""}><CheckIcon aria-hidden="true" />{t(rule.label)}</li>)}</ul>
      <PasswordField label="ยืนยันรหัสผ่าน" name="confirm" autoComplete="new-password" required maxLength={128} value={confirm} onChange={event => { setConfirm(event.target.value); setError(""); }} aria-invalid={confirm.length > 0 && !matches} />
      {confirm.length > 0 && !matches && <p className="auth-hint error">{t("รหัสผ่านทั้งสองช่องไม่ตรงกัน")}</p>}
      <label className="auth-check auth-terms"><input type="checkbox" name="terms" required /><span>{t("ฉันยอมรับ")} <Link href="/terms" target="_blank">{t("ข้อกำหนดการใช้บริการ")}</Link> {t("และ")} <Link href="/privacy" target="_blank">{t("นโยบายความเป็นส่วนตัว")}</Link></span></label>
      {error && <p className="auth-hint error" role="alert">{t(error)}</p>}
      <button className="auth-submit" type="submit">{t("สมัครสมาชิก")}</button>
    </form>
    <SocialLogin mode="register" />
    <p className="auth-switch">{t("มีบัญชีอยู่แล้ว?")} <Link href="/login">{t("เข้าสู่ระบบ")}</Link></p>
  </AuthLayout>;
}
