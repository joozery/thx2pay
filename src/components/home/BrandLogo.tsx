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
  /** Also render the dark-text logo, shown instead of the default one in the light theme. */
  lightVariant?: boolean;
};

export default function BrandLogo({ className = "", eager = false, onClick, lightVariant = false }: BrandLogoProps) {
  const { t } = useI18n();
  return (
    <Link href="/" scroll={false} className={["logo", "brand-logo", lightVariant ? "has-light-logo" : "", className].filter(Boolean).join(" ")} aria-label={t("THX2PAY หน้าหลัก")} onClick={onClick}>
      <Image src="/logo/logo.png" alt="THX2PAY" width={209} height={49} loading={eager ? "eager" : "lazy"} className={lightVariant ? "brand-logo-dark" : undefined} />
      {lightVariant && <Image src="/logo/logowhite.png" alt="" width={635} height={165} loading={eager ? "eager" : "lazy"} className="brand-logo-light" />}
    </Link>
  );
}
