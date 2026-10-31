"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/auth/AuthProvider";
import Link from "next/link";
import Image from "next/image";
import { ChevronRightIcon, EnvelopeClosedIcon, LockClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "./FlowShell";
import "./login-art.css";

export default function LoginFlow() {
  const { t } = useI18n();
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { login } = useAuth();

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!event.currentTarget.reportValidity()) return;
    login(String(new FormData(event.currentTarget).get("email") ?? ""));
    router.push("/");
  }

  return <FlowShell>
    <nav className="flow-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("เข้าสู่ระบบ")}</span></nav>
    <div className="flow-layout flow-login-layout">
      <section className="flow-intro"><Image className="flow-intro-image" src="/images/login-portal.png" alt="" fill priority sizes="(max-width: 760px) 100vw, 550px" /><div className="flow-intro-copy"><span className="flow-kicker">THX2PAY ACCOUNT</span><h1>{t("เข้าสู่ระบบ")}</h1><p>{t("เข้าถึงบัญชีและติดตามรายการของคุณได้ในที่เดียว")}</p></div></section>
      <section className="flow-panel" aria-labelledby="login-title"><h2 id="login-title">{t("ยินดีต้อนรับกลับ")}</h2><p>{t("กรอกอีเมลและรหัสผ่านเพื่อเข้าสู่บัญชี")}</p>
        <form onSubmit={submit} className="flow-form">
          <label>{t("อีเมล")}<span className="flow-input"><EnvelopeClosedIcon /><input type="email" name="email" autoComplete="email" required placeholder="name@example.com" /></span></label>
          <label>{t("รหัสผ่าน")}<span className="flow-input"><LockClosedIcon /><input type={showPassword ? "text" : "password"} name="password" autoComplete="current-password" minLength={8} required /><button type="button" onClick={() => setShowPassword(value => !value)}>{t(showPassword ? "ซ่อน" : "แสดง")}</button></span></label>
          <button className="pill flow-submit" type="submit">{t("เข้าสู่ระบบ")}</button>
        </form>
        <div className="flow-panel-footer"><span>{t("ต้องการความช่วยเหลือเกี่ยวกับบัญชี?")}</span><Link href="/help">{t("ศูนย์ช่วยเหลือ")}</Link></div>
      </section>
    </div>
  </FlowShell>;
}
