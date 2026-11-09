"use client";

import Image from "next/image";
import Link from "next/link";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { accountGame, discountOf, type GameAccount } from "./accounts";
import "./account-card.css";

/** Cover art for an account: the game's key art when we have it, otherwise its icon on a soft backdrop. */
// `eager` for the detail page, where the cover is the above-the-fold LCP image; grid cards stay lazy.
export function AccountCover({ account, sizes, eager = false }: { account: GameAccount; sizes: string; eager?: boolean }) {
  const game = accountGame(account);
  const loading = eager ? "eager" : "lazy";
  return account.cover
    ? <Image src={account.cover} alt="" fill sizes={sizes} style={{ objectFit: "cover" }} loading={loading} />
    : <span className="acc-cover-fallback"><Image src={game.icon} alt="" fill sizes="40px" className="acc-cover-blur" loading={loading} /><Image src={game.icon} alt="" width={84} height={84} className="acc-cover-icon" loading={loading} /></span>;
}

export default function AccountCard({ account }: { account: GameAccount }) {
  const { t, locale, money } = useI18n();
  const game = accountGame(account);
  const discount = discountOf(account);
  return <article className="acc">
    <Link href={`/accounts/${account.id}`} className="acc-link" aria-label={`${t(account.title)} · ${game.name} · ${money(account.price)}`}>
      <span className="acc-cover">
        <AccountCover account={account} sizes="(max-width: 760px) 80vw, 300px" />
        {account.tag && <span className={`acc-tag ${account.tag}`}>{t(account.tag === "hot" ? "ขายดี" : "มาใหม่")}</span>}
        {discount > 0 && <span className="acc-discount">-{money(discount)}</span>}
        <span className="acc-game"><Image src={game.icon} alt="" width={20} height={20} />{game.name}</span>
      </span>
      <span className="acc-body">
        <b className="acc-title">{t(account.title)}</b>
        <span className="acc-specs">{[account.rank, account.level].filter(value => value !== "—").map(value => <span key={value}>{value}</span>)}{account.stats.slice(0, 1).map(item => <span key={item.label}>{t(item.label)} {item.value}</span>)}</span>
        <span className="acc-foot">
          <span className="acc-price"><strong>{money(account.price)}</strong>{account.was && <s>{money(account.was)}</s>}</span>
          <span className="acc-warranty"><CheckCircledIcon aria-hidden="true" />{t("รับประกัน {{count}} วัน", { count: account.warrantyDays })}</span>
        </span>
      </span>
    </Link>
  </article>;
}
