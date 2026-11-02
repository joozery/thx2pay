"use client";

import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "../FlowShell";
import "../login-art.css";
import "./auth.css";

// Shared frame for login / register / forgot password: artwork on the left, glass form panel on the right.
export default function AuthLayout({ crumb, kicker = "THX2PAY ACCOUNT", title, intro, children }: { crumb: string; kicker?: string; title: string; intro: string; children: ReactNode }) {
  const { t } = useI18n();
  return <FlowShell>
    <nav className="flow-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t(crumb)}</span></nav>
    <div className="flow-layout flow-login-layout auth-layout">
      <section className="flow-intro" aria-hidden="true"><Image className="flow-intro-image" src="/images/login-portal.png" alt="" fill priority sizes="(max-width: 760px) 100vw, 550px" /><div className="flow-intro-copy"><span className="flow-kicker">{kicker}</span><p className="auth-intro-title">{t(title)}</p><p>{t(intro)}</p></div></section>
      <section className="auth-panel">{children}</section>
    </div>
  </FlowShell>;
}
