"use client";

import { useI18n } from "@/i18n/useI18n";

import Link from "next/link";
import Image from "next/image";
import type { MouseEventHandler } from "react";
import "./brand-logo.css";

type BrandLogoProps = {
  className?: string;
  eager?: boolean;
  onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function BrandLogo({ className = "", eager = false, onClick }: BrandLogoProps) {
  const { t } = useI18n();
  return (
    <Link href="/" scroll={false} className={["logo", "brand-logo", className].filter(Boolean).join(" ")} aria-label={t("THX2PAY หน้าหลัก")} onClick={onClick}>
      <Image src="/logo/logo.png" alt="THX2PAY" width={209} height={49} loading={eager ? "eager" : "lazy"} />
    </Link>
  );
}
