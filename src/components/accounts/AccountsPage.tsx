"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronDownIcon, ChevronRightIcon, Cross2Icon, LockClosedIcon, MagnifyingGlassIcon, ReloadIcon, CheckCircledIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import AccountCard from "./AccountCard";
import { accountGame, accountGames, gameAccounts } from "./accounts";
import "@/components/topup/topup.css";
import "@/components/topup/topup-finder.css";
import "./accounts.css";

type Sort = "recommended" | "price-asc" | "price-desc";
const priceRanges = [
  { id: "all", label: "ทุกราคา", min: 0, max: Infinity },
  { id: "under-1000", label: "ต่ำกว่า ฿1,000", min: 0, max: 999 },
  { id: "1000-3000", label: "฿1,000 – ฿3,000", min: 1000, max: 3000 },
  { id: "over-3000", label: "มากกว่า ฿3,000", min: 3001, max: Infinity },
] as const;

const trust = [
  { icon: CheckCircledIcon, title: "ตรวจสอบทุกไอดี", text: "ทีมงานเช็กข้อมูลและสเปกก่อนลงขาย" },
  { icon: LockClosedIcon, title: "เปลี่ยนข้อมูลเป็นของคุณ", text: "ช่วยเปลี่ยนอีเมลและรหัสผ่านหลังรับไอดี" },
  { icon: ReloadIcon, title: "รับประกันทุกไอดี", text: "มีปัญหาในช่วงรับประกัน เปลี่ยนหรือคืนเงิน" },
];

export default function AccountsPage() {
  const { t, locale } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [game, setGame] = useState("all");
  const [price, setPrice] = useState<(typeof priceRanges)[number]["id"]>("all");
  const [sort, setSort] = useState<Sort>("recommended");
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);

  // Links such as /accounts?game=valorant open with that game selected.
  useEffect(() => {
    function readGame() {
      const id = new URLSearchParams(window.location.search).get("game");
      if (id && accountGames.some(item => item.id === id)) setGame(id);
    }
    readGame();
  }, []);

  const range = priceRanges.find(item => item.id === price)!;
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const results = gameAccounts.filter(account => {
    const info = accountGame(account);
    const text = `${account.title} ${t(account.title)} ${account.rank} ${info.name} ${info.aliases}`.toLocaleLowerCase();
    return (game === "all" || account.game === game) && account.price >= range.min && account.price <= range.max && words.every(word => text.includes(word));
  });
  if (sort === "price-asc") results.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") results.sort((a, b) => b.price - a.price);

  const hasFilters = Boolean(query.trim()) || game !== "all" || price !== "all";
  const selectedGame = accountGames.find(item => item.id === game);
  function clearFilters() { setQuery(""); setGame("all"); setPrice("all"); }
  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/accounts");
  }

  return <>
    <Navbar activePage="accounts" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page accounts-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("ไอดีเกม")}</span></nav>
      <PageHero id="accounts-title" eyebrow="GAME ACCOUNTS" title="ไอดีเกมพร้อมเล่น" accent="คัดคุณภาพ รับประกันทุกไอดี" description="ซื้อไอดีเกมที่ผ่านการตรวจสอบ พร้อมเปลี่ยนข้อมูลเป็นของคุณ" image="/images/games/valorant-concept-official.jpg" imageAlt="VALORANT" imagePosition="center 30%" cta={{ label: "เลือกไอดี", href: "#accounts-list" }} />

      <ul className="accounts-trust">{trust.map(({ icon: Icon, title, text }) => <li key={title}><span><Icon /></span><div><b>{t(title)}</b><small>{t(text)}</small></div></li>)}</ul>

      <section ref={resultsRef} id="accounts-list" className="topup-catalog accounts-catalog" aria-labelledby="accounts-list-title">
        <div className="topup-catalog-heading"><div><span className="topup-section-label">ACCOUNT MARKET</span><h2 id="accounts-list-title">{t("เลือกไอดีเกม")}</h2><p>{t("กรองตามเกมและงบประมาณ แล้วกดดูรายละเอียดไอดี")}</p></div><span className="topup-game-count" role="status" aria-live="polite">{t("พบ {{count}} ไอดี", { count: results.length })}</span></div>

        <div className="accounts-games" role="group" aria-label={t("กรองตามเกม")}>
          <button type="button" aria-pressed={game === "all"} onClick={() => setGame("all")}>{t("ทุกเกม")}<small>{gameAccounts.length}</small></button>
          {accountGames.map(item => <button type="button" key={item.id} aria-pressed={game === item.id} onClick={() => setGame(item.id)}><Image src={item.icon} alt="" width={24} height={24} />{item.name}<small>{gameAccounts.filter(account => account.game === item.id).length}</small></button>)}
        </div>

        <div className="topup-finder accounts-finder">
          <form className="topup-finder-search" role="search" onSubmit={event => { event.preventDefault(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
            <MagnifyingGlassIcon aria-hidden="true" />
            <input type="search" aria-label={t("ค้นหาไอดีเกม")} placeholder={t("ค้นหา เช่น Immortal, AR 60, สกินมีด…")} value={query} onChange={event => setQuery(event.target.value)} enterKeyHint="search" />
            {query && <button type="button" className="topup-finder-clear" aria-label={t("ล้างคำค้นหา")} onClick={() => setQuery("")}><Cross2Icon /></button>}
          </form>
          <div className="topup-finder-row">
            <div className="topup-finder-selects">
              <label className={`topup-chip-select${price !== "all" ? " is-set" : ""}`}><span>{t("ช่วงราคา")}</span><select value={price} onChange={event => setPrice(event.target.value as typeof price)}>{priceRanges.map(item => <option key={item.id} value={item.id}>{t(item.label)}</option>)}</select><ChevronDownIcon aria-hidden="true" /></label>
              <label className="topup-chip-select"><span>{t("เรียงตาม")}</span><select value={sort} onChange={event => setSort(event.target.value as Sort)}><option value="recommended">{t("แนะนำ")}</option><option value="price-asc">{t("ราคาต่ำไปสูง")}</option><option value="price-desc">{t("ราคาสูงไปต่ำ")}</option></select><ChevronDownIcon aria-hidden="true" /></label>
            </div>
          </div>
        </div>

        {hasFilters && <div className="topup-active-filters" role="group" aria-label={t("ตัวกรองที่ใช้อยู่")}>
          <span className="topup-active-count">{t("พบ {{count}} ไอดี", { count: results.length })}</span>
          {query.trim() && <button type="button" className="topup-filter-chip" onClick={() => setQuery("")} aria-label={`${t("ลบตัวกรอง")} “${query.trim()}”`}>“{query.trim()}”<Cross2Icon aria-hidden="true" /></button>}
          {selectedGame && <button type="button" className="topup-filter-chip" onClick={() => setGame("all")} aria-label={`${t("ลบตัวกรอง")} ${selectedGame.name}`}>{selectedGame.name}<Cross2Icon aria-hidden="true" /></button>}
          {price !== "all" && <button type="button" className="topup-filter-chip" onClick={() => setPrice("all")} aria-label={`${t("ลบตัวกรอง")} ${t(range.label)}`}>{t(range.label)}<Cross2Icon aria-hidden="true" /></button>}
          <button type="button" className="topup-filter-clear-all" onClick={clearFilters}>{t("ล้างตัวกรอง")}</button>
        </div>}

        <div className="accounts-grid">{results.map(account => <AccountCard key={account.id} account={account} />)}</div>
        {!results.length && <div className="topup-empty"><MagnifyingGlassIcon /><h3>{t("ยังไม่พบไอดีที่ตรงกับตัวกรอง")}</h3><p>{t("ลองเปลี่ยนเกม ช่วงราคา หรือคำค้นหา")}</p><button className="pill" onClick={clearFilters}>{t("ล้างตัวกรอง")}</button></div>}
        <p className="accounts-note">{t("รายการและราคาเป็นตัวอย่าง ยังไม่เปิดขายจริง")} · {t("ราคาเริ่มต้น")} ฿{Math.min(...gameAccounts.map(item => item.price)).toLocaleString(locale)}</p>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}
