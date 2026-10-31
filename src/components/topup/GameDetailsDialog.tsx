"use client";

import Image from "next/image";
import { Dialog } from "radix-ui";
import { Cross2Icon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import type { Game } from "./games";

export default function GameDetailsDialog({ game, onClose }: { game: Game | null; onClose: () => void }) {
  const { t } = useI18n();
  return (
    <Dialog.Root open={!!game} onOpenChange={open => { if (!open) onClose(); }}>
      <Dialog.Portal>
        <Dialog.Overlay className="dialog-overlay" />
        <Dialog.Content className="dialog topup-game-dialog">
          {game && <>
            <div className="topup-detail-image"><span className="topup-game-art" aria-hidden="true"><Image src={game.icon} alt="" fill sizes="450px" style={{ objectFit: "cover" }} /></span></div>
            <span className="topup-detail-platform">{game.platforms.join(" · ")} · {game.genre}</span>
            <Dialog.Title>{game.name}</Dialog.Title>
            <Dialog.Description>{t("แพ็กเกจเติมเกมออนไลน์กำลังเตรียมให้บริการ สอบถามแพ็กเกจและวิธีเติมเกมกับทีมงานได้โดยตรง")}</Dialog.Description>
            <a className="pill" href={`mailto:support@thx2pay.com?subject=${encodeURIComponent(`${t("สอบถามแพ็กเกจ")} ${game.name}`)}`}><EnvelopeClosedIcon />{t("สอบถามแพ็กเกจ")}</a>
          </>}
          <Dialog.Close className="dialog-close icon-button" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
