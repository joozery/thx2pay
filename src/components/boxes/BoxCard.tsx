"use client";

import Image from "next/image";
import Link from "next/link";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { boxGame, jackpotOf, type MysteryBox } from "./boxes";
import "@/components/accounts/account-card.css";
import "./boxes.css";

export default function BoxCard({ box }: { box: MysteryBox }) {
  const { t, money } = useI18n();
  const game = boxGame(box);
  const jackpot = jackpotOf(box);
  return <article className="box-card">
    <Link href={`/boxes/${box.id}`} className="box-card-link" aria-label={`${t(box.name)} · ${money(box.price)}`}>
      <span className="box-card-art">
        <Image src="/images/promotions/mystery-box.png" alt="" fill sizes="(max-width: 760px) 50vw, 300px" style={{ objectFit: "cover" }} />
        <span className="box-card-game"><Image src={game.icon} alt="" width={44} height={44} /></span>
        {box.tag && <span className={`acc-tag ${box.tag}`}>{t(box.tag === "hot" ? "ขายดี" : "มาใหม่")}</span>}
      </span>
      <span className="box-card-body">
        <b>{t(box.name)}</b>
        <small className="box-card-jackpot"><StarFilledIcon aria-hidden="true" />{t("ลุ้นรางวัลใหญ่")}: {t(jackpot.name)}</small>
        <span className="box-card-foot"><strong>{money(box.price)}</strong><span>{t("เปิดกล่อง")}</span></span>
      </span>
    </Link>
  </article>;
}
