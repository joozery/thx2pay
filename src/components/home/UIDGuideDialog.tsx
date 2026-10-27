"use client";

import { useI18n } from "@/i18n/useI18n";

import { Dialog } from "radix-ui";
import { ChevronRightIcon, Cross2Icon } from "@radix-ui/react-icons";

export default function UIDGuideDialog() {
  const { t } = useI18n();
  return (
    <Dialog.Root>
      <Dialog.Trigger className="uid-guide-trigger">{t("ดูวิธีหา UID")}{" "}<ChevronRightIcon /></Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog uid-guide-dialog">
          <Dialog.Title>{t("วิธีหา UID ของคุณ")}</Dialog.Title>
          <Dialog.Description>{t("UID คือหมายเลขประจำบัญชีเกม ใช้ระบุบัญชีที่ต้องการเติมเกม")}</Dialog.Description>
          <ol>
            <li>{t("เปิดเกมที่ต้องการเติม แล้วไปที่หน้าโปรไฟล์ผู้เล่น")}</li>
            <li>{t("มองหาหมายเลข UID, User ID หรือ Player ID โดยตำแหน่งอาจต่างกันในแต่ละเกม")}</li>
            <li>{t("คัดลอกหมายเลข และตรวจสอบให้ตรงกับบัญชีของคุณก่อนเลือกแพ็กเกจ")}</li>
          </ol>
          <a href="mailto:support@thx2pay.com" className="pill">{t("สอบถามทีมงาน")}</a>
          <Dialog.Close className="dialog-close icon-button" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
