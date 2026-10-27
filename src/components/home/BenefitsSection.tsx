"use client";

import { useI18n } from "@/i18n/useI18n";

import "./benefits.css";
import RevealSection from "./RevealSection";
import Artwork from "./Artwork";
import UIDGuideDialog from "./UIDGuideDialog";

export default function BenefitsSection() {
  const { t } = useI18n();
  return (
    <RevealSection className="benefits uid-benefits" aria-labelledby="benefits-title">
      <div className="center-heading">
        <h2 id="benefits-title">{t("เติมเกมง่าย ๆ ไม่ซับซ้อน!")}</h2>
        <p>{t("ไม่ต้องใช้รหัสผ่าน ไม่ต้องรอแอดมิน")}<br />{t("ใช้แค่ UID ของคุณก็เติมได้ทันที")}</p>
      </div>
      <div className="benefit-grid">
        <div className="feature-card uid-game-card">
          <h3>{t("ส่งไอเทมทันที")}</h3>
          <h3>{t("เลือก")}<br />{t("เกมของคุณ")}</h3>
        </div>
        <div className="support-card uid-package-card">
          <Artwork src="/images/category-gamer.webp" sizes="150px" w={1} h={1} label={t("เกมเมอร์พร้อมเติมเกมโปรด")} className="support-portrait" />
          <span className="person-icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="7" width="18" height="11" rx="4" />
              <path d="M7 10v5m-2.5-2.5h5M16 11h.01M18 14h.01" />
            </svg>
          </span>
          <h3>{t("ใส่ UID")}<br />{t("เลือกแพ็กเกจ")}</h3>
          <p>{t("ระบบตรวจชื่อในเกมให้อัตโนมัติ มั่นใจว่าเติมเข้าบัญชีที่ถูกต้อง")}</p>
          <UIDGuideDialog />
        </div>
        <div className="feature-card uid-payment-card">
          <span className="payment-icon" aria-hidden="true">$</span>
          <h3>{t("ชำระเงิน")}<br />{t("ปลอดภัย")}</h3>
        </div>
      </div>
    </RevealSection>
  );
}
