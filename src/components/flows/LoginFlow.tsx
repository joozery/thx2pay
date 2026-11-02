"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useAuth } from "@/auth/AuthProvider";
import { useI18n } from "@/i18n/useI18n";
import AuthLayout from "./auth/AuthLayout";
import PasswordField from "./auth/PasswordField";
import SocialLogin from "./auth/SocialLogin";

export default function LoginFlow() {
  const { t } = useI18n();
  const router = useRouter();
  const { login } = useAuth();
  const [remember, setRemember] = useState(true);

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    login(String(new FormData(event.currentTarget).get("email") ?? ""));
    router.push("/");
  }

  return <AuthLayout crumb="เข้าสู่ระบบ" title="เข้าสู่ระบบ" intro="เข้าถึงบัญชีและติดตามรายการของคุณได้ในที่เดียว">
    <div className="auth-head"><h1>{t("ยินดีต้อนรับกลับ")}</h1><p>{t("เข้าสู่ระบบเพื่อเติมเกมและดูประวัติการเติมของคุณ")}</p></div>
    <form onSubmit={submit} className="auth-form">
      <label className="auth-field"><span>{t("อีเมล")}</span><span className="auth-input"><EnvelopeClosedIcon aria-hidden="true" /><input type="email" name="email" autoComplete="email" required placeholder="name@example.com" /></span></label>
      <PasswordField label="รหัสผ่าน" name="password" autoComplete="current-password" minLength={8} required placeholder="••••••••" />
      <div className="auth-row">
        <label className="auth-check"><input type="checkbox" checked={remember} onChange={event => setRemember(event.target.checked)} /><span>{t("จดจำฉันไว้")}</span></label>
        <Link className="auth-link" href="/forgot-password">{t("ลืมรหัสผ่าน?")}</Link>
      </div>
      <button className="auth-submit" type="submit">{t("เข้าสู่ระบบ")}</button>
    </form>
    <SocialLogin />
    <p className="auth-switch">{t("ยังไม่มีบัญชี?")} <Link href="/register">{t("สมัครสมาชิก")}</Link></p>
  </AuthLayout>;
}
