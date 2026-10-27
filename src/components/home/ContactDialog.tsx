"use client";

import { useI18n } from "@/i18n/useI18n";

import { motion } from "motion/react";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";

export default function ContactDialog({ title, onClose }: { title: string; onClose: () => void }) {
  const { t } = useI18n();

  return (
    <Dialog.Root open={!!title} onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay asChild><motion.div className="dialog-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /></Dialog.Overlay>
        <Dialog.Content asChild>
        <motion.div className="dialog" style={{ x: "-50%", y: "-50%" }} initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}>
          <Dialog.Title>
            {t(title)}
          </Dialog.Title>
          <Dialog.Description>
            {t(title === "ตะกร้าสินค้า" ? "ยังไม่มีสินค้าในตะกร้าของคุณ เลือกหมวดหมู่เกมเพื่อเริ่มต้น" : title === "เข้าสู่ระบบ" ? "ระบบสมาชิกกำลังอยู่ระหว่างเตรียมให้บริการ ติดต่อทีมงานเพื่อสอบถามข้อมูลเพิ่มเติม" : "สอบถามรายละเอียดและรับคำแนะนำจากทีมงาน THX2PAY ได้ทางอีเมล")}
          </Dialog.Description>
          <a className="pill" href="mailto:support@thx2pay.com">{t("ติดต่อ support@thx2pay.com")}</a>
          <Dialog.Close className="dialog-close icon-button" aria-label={t("ปิด")}>
            <Cross2Icon />
          </Dialog.Close>
        </motion.div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
