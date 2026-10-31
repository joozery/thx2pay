"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "motion/react";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import type { Game } from "./games";
import "./game-card.css";

export default function GameCard({ game, onSelect }: { game: Game; onSelect: (game: Game) => void }) {
  const { t } = useI18n();
  const reduceMotion = useReducedMotion();
  return (
    <motion.article className="gc" layout="position" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: reduceMotion ? 0 : 0.2 }}>
      <button type="button" className="gc-button" onClick={() => onSelect(game)} aria-label={`${t("ดูรายละเอียด")} ${game.name}`}>
        <span className="gc-art">
          <Image src={game.icon} alt="" fill sizes="(max-width: 760px) 44vw, (max-width: 1100px) 28vw, 220px" style={{ objectFit: "cover" }} />
          {game.tag && <span className={`gc-tag ${game.tag}`}>{t(game.tag === "new" ? "มาใหม่" : "เกมแนะนำ")}</span>}
        </span>
        <span className="gc-info">
          <span className="gc-text"><b>{game.name}</b><small>{game.genre} · {game.platforms.join(", ")}</small></span>
          <ChevronRightIcon aria-hidden="true" />
        </span>
      </button>
    </motion.article>
  );
}
