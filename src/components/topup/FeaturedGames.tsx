"use client";

import Image from "next/image";
import { RocketIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import type { Game, GameTag } from "./games";

export default function FeaturedGames({ tag, games, onSelect }: { tag: GameTag; games: Game[]; onSelect: (game: Game) => void }) {
  const { t } = useI18n();
  const label = tag === "recommended" ? "เกมแนะนำ" : "เกมใหม่";
  const Icon = tag === "recommended" ? StarFilledIcon : RocketIcon;

  return <section className="topup-featured-section" aria-labelledby={`${tag}-games-title`}>
    <div className="topup-featured-heading"><div><span className="topup-section-label">{tag === "recommended" ? "RECOMMENDED GAMES" : "NEW TO CATALOG"}</span><h2 id={`${tag}-games-title`}><Icon />{t(label)}</h2><p>{t("กดไอคอนเกมเพื่อดูรายละเอียดและสอบถามแพ็กเกจ")}</p></div></div>
    <div className="topup-featured-list">{games.map(game => <button className="topup-featured-game" key={game.id} type="button" onClick={() => onSelect(game)} aria-label={`${t("ดูรายละเอียด")} ${game.name}`}>
      <span className="topup-featured-icon"><Image src={game.icon} alt="" fill sizes="(max-width: 760px) 132px, 162px" style={{ objectFit: "cover" }} /></span>
      <span className="topup-featured-copy"><strong>{game.name}</strong><small>{game.genre}</small></span>
    </button>)}</div>
  </section>;
}
