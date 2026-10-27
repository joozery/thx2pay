"use client";

import { useI18n } from "@/i18n/useI18n";

import RevealSection from "./RevealSection";

import { ArrowRightIcon } from "@radix-ui/react-icons";
import Artwork from "./Artwork";
import type { DialogHandler } from "./types";

export default function PartnerSection({ onOpenDialog }: { onOpenDialog: DialogHandler }) {
  const { t } = useI18n();

  return (
    <RevealSection className="partner" id="partner">
      <div className="mascot-card">
        <Artwork src="/images/mascot-lion.webp" w={207} h={179} label={t("มาสคอตสิงโต THX2PAY")} />
        <span className="pill">{t("ร่วมเป็นตัวแทนได้แล้ว")}</span>
      </div>
      <div className="partner-copy">
        <h2>{t("ปลดล็อกความสนุก")}<br />{t("กับ THX2PAY &")}<br />{t("เติมปลอดภัย")}<br />{t("ทุกออเดอร์")}</h2>
        <p>{t("สมัครเป็นตัวแทนกับเราวันนี้ รับส่วนลดพิเศษ และสิทธิประโยชน์มากมาย")}</p>
        <button className="pill wide" onClick={() => onOpenDialog("สมัครตัวแทนจำหน่าย")}>{t("สมัครตัวแทนจำหน่าย")}{" "}<ArrowRightIcon /></button>
      </div>
    </RevealSection>
  );
}
