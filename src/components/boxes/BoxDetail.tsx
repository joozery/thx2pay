"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ArrowRightIcon, CheckIcon, ChevronRightIcon, Cross2Icon, ReloadIcon, StarFilledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import { findAccount } from "@/components/accounts/accounts";
import BoxCard from "./BoxCard";
import { boxGame, drawPrize, mysteryBoxes, rarityLabels, type BoxPrize, type MysteryBox } from "./boxes";
import "@/components/topup/topup.css";
import "@/components/flows/wallet.css";
import "@/components/accounts/accounts.css";
import "./boxes.css";

// Reel geometry: the winning tile sits near the end of a long strip so the spin has room to build up speed.
const TILE = 132;
const GAP = 10;
const STEP = TILE + GAP;
const STRIP_LENGTH = 60;
const WIN_INDEX = 52;
const SPIN_MS = 6500;

type Win = { prize: BoxPrize; at: string };

/** Server-safe starting strip: prizes in order, repeated (no randomness, so hydration matches). */
const idleStrip = (box: MysteryBox) => Array.from({ length: 16 }, (_, index) => box.prizes[index % box.prizes.length]);

function PrizeArt({ prize, box, size }: { prize: BoxPrize; box: MysteryBox; size: number }) {
  const account = prize.accountId ? findAccount(prize.accountId) : undefined;
  const game = boxGame(box);
  return account?.cover
    ? <span className="prize-art is-cover"><Image src={account.cover} alt="" fill sizes={`${size * 2}px`} style={{ objectFit: "cover" }} /></span>
    : <span className="prize-art"><Image src={game.icon} alt="" width={size} height={size} /></span>;
}

function PrizeTile({ prize, box }: { prize: BoxPrize; box: MysteryBox }) {
  const { t } = useI18n();
  return <div className={`prize-tile ${prize.rarity}`}>
    <PrizeArt prize={prize} box={box} size={56} />
    <b>{t(prize.name)}</b>
    <small>{t(rarityLabels[prize.rarity])}</small>
  </div>;
}

export default function BoxDetail({ box }: { box: MysteryBox }) {
  const { t, locale } = useI18n();
  const router = useRouter();
  const game = boxGame(box);
  const money = (amount: number) => `฿${amount.toLocaleString(locale)}`;
  const others = mysteryBoxes.filter(item => item.id !== box.id).slice(0, 4);

  const viewport = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const [strip, setStrip] = useState<BoxPrize[]>(() => idleStrip(box));
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState<Win | null>(null);
  const [history, setHistory] = useState<Win[]>([]);
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function finish(prize: BoxPrize) {
    const win = { prize, at: new Date().toLocaleTimeString(locale, { hour: "2-digit", minute: "2-digit", second: "2-digit" }) };
    setSpinning(false);
    setResult(win);
    setHistory(items => [win, ...items].slice(0, 8));
  }

  function open() {
    if (spinning) return;
    const prize = drawPrize(box);
    const next = Array.from({ length: STRIP_LENGTH }, (_, index) => index === WIN_INDEX ? prize : drawPrize(box));
    setResult(null);
    setSpinning(true);
    setStrip(next);

    // Wait for the new strip to render, snap back to the start, then glide to the winner.
    requestAnimationFrame(() => {
      const el = track.current;
      const width = viewport.current?.clientWidth ?? 0;
      if (!el) return;
      const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      const jitter = (Math.random() - 0.5) * TILE * 0.7;
      const offset = WIN_INDEX * STEP + TILE / 2 - width / 2 + jitter;
      el.style.transition = "none";
      el.style.transform = "translateX(0)";
      void el.offsetWidth;
      el.style.transition = reduce ? "none" : `transform ${SPIN_MS}ms cubic-bezier(.08,.6,.12,1)`;
      el.style.transform = `translateX(${-offset}px)`;
      timer.current = window.setTimeout(() => finish(prize), reduce ? 300 : SPIN_MS + 250);
    });
  }

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "ไอดีเกม" ? "/accounts" : "/topup");
  }

  const won = result?.prize;
  const wonAccount = won?.accountId ? findAccount(won.accountId) : undefined;

  return <>
    <Navbar activePage="boxes" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page accounts-page boxes-page" id="top">
      <div className="wallet-page">
        <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><Link href="/boxes">{t("กล่องสุ่ม")}</Link><ChevronRightIcon /><span>{t(box.name)}</span></nav>

        <section className="box-stage" aria-labelledby="box-title">
          <div className="box-stage-head">
            <span className="box-stage-icon"><Image src={game.icon} alt="" width={56} height={56} /></span>
            <div>
              <span className="wallet-eyebrow">MYSTERY BOX · {game.name}</span>
              <h1 id="box-title">{t(box.name)}</h1>
              <p>{t("กดเปิดกล่องแล้วรอรางเลื่อนหยุด รางวัลที่อยู่ใต้ลูกศรคือของคุณ")}</p>
            </div>
            <span className="wallet-test-badge">{t("โหมดทดสอบ")}</span>
          </div>

          <div className="reel" ref={viewport}>
            <span className="reel-marker top" aria-hidden="true" />
            <span className="reel-marker bottom" aria-hidden="true" />
            <div className="reel-track" ref={track} aria-hidden="true">{strip.map((prize, index) => <PrizeTile key={index} prize={prize} box={box} />)}</div>
          </div>
          <p className="sr-only" role="status" aria-live="polite">{spinning ? t("กำลังหมุน…") : won ? `${t("คุณได้รับ")} ${t(won.name)}` : ""}</p>

          <div className="box-stage-actions">
            <button type="button" className="wallet-primary box-open" onClick={open} disabled={spinning}>
              {spinning ? <><ReloadIcon className="box-spin-icon" />{t("กำลังหมุน…")}</> : <>{t(history.length ? "เปิดอีกครั้ง" : "เปิดกล่อง")} {money(box.price)}<ArrowRightIcon /></>}
            </button>
            <p className="wallet-form-note"><CheckIcon />{t("โหมดทดสอบ — การเปิดกล่องเป็นการจำลอง ไม่มีการเรียกเก็บเงินหรือส่งของรางวัลจริง")}</p>
          </div>
        </section>

        <div className="box-info">
          <section className="wallet-card" aria-labelledby="box-prizes-title">
            <div className="wallet-card-head"><div><h2 id="box-prizes-title">{t("ของรางวัลและอัตราออก")}</h2><p>{t("แต่ละครั้งที่เปิดจะได้รับ 1 รางวัลตามอัตรานี้")}</p></div></div>
            <ul className="box-odds">{[...box.prizes].reverse().map(prize => <li key={prize.id} className={prize.rarity}>
              <PrizeArt prize={prize} box={box} size={40} />
              <div><b>{t(prize.name)}</b><small>{t(rarityLabels[prize.rarity])} · {t("มูลค่า")} {money(prize.value)}</small>{prize.accountId && <Link href={`/accounts/${prize.accountId}`}>{t("ดูรายละเอียดไอดี")}</Link>}</div>
              <strong>{prize.chance}%</strong>
            </li>)}</ul>
          </section>

          <section className="wallet-card" aria-labelledby="box-history-title">
            <div className="wallet-card-head"><div><h2 id="box-history-title">{t("ประวัติการเปิด")}</h2><p>{t("ผลการเปิดกล่องในรอบนี้ (ตัวอย่าง)")}</p></div></div>
            {history.length
              ? <ul className="box-history">{history.map((item, index) => <li key={`${item.at}-${index}`} className={item.prize.rarity}><span className="box-history-dot" /><b>{t(item.prize.name)}</b><small>{item.at}</small></li>)}</ul>
              : <p className="box-history-empty">{t("ยังไม่มีการเปิดกล่อง")}</p>}
          </section>
        </div>

        <section className="acd-more" aria-labelledby="box-more-title">
          <div className="topup-catalog-heading"><div><span className="topup-section-label">MORE BOXES</span><h2 id="box-more-title">{t("กล่องอื่น ๆ")}</h2></div><Link href="/boxes" className="accounts-all">{t("ดูทั้งหมด")}<ArrowRightIcon /></Link></div>
          <div className="boxes-grid">{others.map(item => <BoxCard key={item.id} box={item} />)}</div>
        </section>
      </div>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />

    <Dialog.Root open={!!won} onOpenChange={value => { if (!value) setResult(null); }}><Dialog.Portal><Dialog.Overlay className="wallet-modal-overlay" /><Dialog.Content className={`wallet-modal box-win ${won?.rarity ?? ""}`}>
      {won && <>
        <Dialog.Close className="wallet-modal-close" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close>
        <span className="box-win-rarity">{won.rarity === "legendary" && <StarFilledIcon />}{t(rarityLabels[won.rarity])}</span>
        <div className="box-win-art"><PrizeArt prize={won} box={box} size={88} /></div>
        <Dialog.Title>{t("ยินดีด้วย! คุณได้รับ")}</Dialog.Title>
        <p className="box-win-name">{t(won.name)}</p>
        <Dialog.Description>{t(wonAccount ? "ในการใช้งานจริง ข้อมูลไอดีจะถูกส่งไปที่อีเมลของคุณ" : "ในการใช้งานจริง ของรางวัลจะถูกส่งเข้า UID ของคุณ")}</Dialog.Description>
        <div className="wallet-modal-actions">
          {wonAccount ? <Link href={`/accounts/${wonAccount.id}`} className="box-win-link">{t("ดูรายละเอียดไอดี")}</Link> : <Dialog.Close>{t("ปิด")}</Dialog.Close>}
          <button type="button" className="wallet-primary" onClick={() => { setResult(null); requestAnimationFrame(open); }}>{t("เปิดอีกครั้ง")} {money(box.price)}</button>
        </div>
      </>}
    </Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
