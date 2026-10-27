"use client";

import { useI18n } from "@/i18n/useI18n";

import Image from "next/image";
import "./footer.css";
import BrandLogo from "./BrandLogo";
import type { DialogHandler } from "./types";

const socialIcons = [
  { name: "Facebook", file: "facebook" },
  { name: "LINE", file: "line" },
  { name: "Instagram", file: "instagram" },
  { name: "YouTube", file: "youtube" },
  { name: "TikTok", file: "tiktok" },
];

const paymentLogos = [
  { name: "PromptPay", file: "promptpay.png" },
  { name: "TrueMoney", file: "truemoney.png" },
  { name: "Visa", file: "visa.svg" },
  { name: "Mastercard", file: "mastercard.svg" },
  { name: "JCB", file: "jcb.svg" },
  { name: "Alipay", file: "alipay.svg" },
  { name: "WeChat Pay", file: "wechat-pay.svg" },
];

export default function Footer({ onOpenDialog }: { onOpenDialog: DialogHandler }) {
  const { t } = useI18n();

  return (
    <footer>
      <div className="container">
        <div className="footer-top">
          <div>
            <BrandLogo />
            <p>{t("เติมเกมออนไลน์ 24 ชั่วโมง ปลอดภัย ไว้ใจได้ 100%")}<br />{t("พร้อมดูแลคุณตลอดการใช้งาน")}</p>
            <div className="socials">
              {socialIcons.map(({ name, file }) => (
                <button key={file} type="button" aria-label={t("ติดต่อผ่าน {{name}}", { name })} onClick={() => onOpenDialog(`ติดต่อเรา · ${name}`)}>
                  <Image src={`/icons/social/${file}.svg`} alt="" aria-hidden="true" width={20} height={20} unoptimized className="footer-social-icon" />
                </button>
              ))}
            </div>
          </div>
          <div className="contact">
            <h3>{t("Contact Us")}</h3>
            <a href="mailto:support@thx2pay.com">Email : support@thx2pay.com</a>
            <p>{t("เวลาให้บริการ : 09:00 - 24:00 น.")}</p>
          </div>
        </div>
        <div className="footer-bottom">
          <small>© 2024 THX2PAY. All rights reserved.</small>
          <button onClick={() => onOpenDialog("Privacy Policy")}>{t("Privacy Policy")}</button>
          <button onClick={() => onOpenDialog("Terms of Service")}>{t("Terms of Service")}</button>
          <div className="payments" aria-label={t("ช่องทางชำระเงิน")}>
            {paymentLogos.map(({ name, file }) => (
              <span className="payment-badge" key={file} title={t(name)}>
                <Image src={`/icons/payments/${file}`} alt={t(name)} width={72} height={40} unoptimized className="payment-logo" />
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
