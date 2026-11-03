"use client";

import Image from "next/image";
import Link from "next/link";
import { RocketIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import type { Game, GameTag } from "./games";

export default function FeaturedGames({ tag, games }: { tag: GameTag; games: Game[] }) {
  const { t } = useI18n();
  const label = tag === "recommended" ? "เกมแนะนำ" : "เกมใหม่";
  const Icon = tag === "recommended" ? StarFilledIcon : RocketIcon;

  return <section className="topup-featured-section" aria-labelledby={`${tag}-games-title`}>
    <div className="topup-featured-heading"><div><span className="topup-section-label">{tag === "recommended" ? "RECOMMENDED GAMES" : "NEW TO CATALOG"}</span><h2 id={`${tag}-games-title`}><Icon />{t(label)}</h2><p>{t("กดไอคอนเกมเพื่อเลือกแพ็กเกจและเติมเกม")}</p></div></div>
    <div className="topup-featured-list">{games.map(game => <Link className="topup-featured-game" key={game.id} href={`/topup/${game.id}`} aria-label={`${t("เติมเกม")} ${game.name}`}>
      <span className="topup-featured-icon"><Image src={game.icon} alt="" fill sizes="(max-width: 760px) 132px, 162px" style={{ objectFit: "cover" }} /></span>
      <span className="topup-featured-copy"><strong>{game.name}</strong><small>{game.genre}</small></span>
    </Link>)}</div>
  </section>;
}
