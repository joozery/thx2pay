"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "motion/react";
import { MagnifyingGlassIcon, Cross2Icon, ChevronRightIcon, ChevronDownIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import PlatformIcon from "@/components/home/PlatformIcon";
import GameCard from "./GameCard";
import FeaturedGames from "./FeaturedGames";
import { games, genres, type GamePlatform } from "./games";
import "./topup.css";
import "./topup-v2.css";
import "./topup-finder.css";

type PlatformFilter = "all" | GamePlatform;

export default function TopupPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("popular");
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filteredGames = games.filter(game => (platform === "all" || game.platforms.includes(platform)) && (genre === "all" || game.genre === genre) && words.every(word => `${game.name} ${game.publisher ?? ""} ${game.aliases}`.toLocaleLowerCase().includes(word)));
  if (sort === "name") filteredGames.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    document.title = t("เติมเกมออนไลน์ | THX2PAY");
  }, [language]);

  // Old links (/topup?game=<id>&uid=…) go straight to that game's checkout.
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get("game");
    if (!id || !games.some(game => game.id === id)) return;
    params.delete("game");
    router.replace(`/topup/${id}${params.size ? `?${params}` : ""}`);
  }, [router]);
  const hasFilters = Boolean(query.trim()) || platform !== "all" || genre !== "all";
  function clearFilters() { setQuery(""); setPlatform("all"); setGenre("all"); }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: "easeOut" }}>
      <Navbar activePage="games" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
      <main className="container topup-page" id="top">
        <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("เติมเกม")}</span></nav>
        <PageHero id="topup-title" eyebrow="THX2PAY GAME TOP-UP" title="เติมเกมโปรดของคุณ" accent="ความสนุกเริ่มได้ที่นี่" description="เลือกเกมที่ต้องการ แล้วค้นหาแพ็กเกจที่เหมาะกับคุณ" image="/images/games/free-fire-official-hd.jpg" imageAlt="Free Fire" imagePosition="60% center" cta={{ label: "เลือกเกม", href: "#topup-games" }} />
        <FeaturedGames tag="recommended" games={games.filter(game => game.tag === "recommended")} />
        <FeaturedGames tag="new" games={games.filter(game => game.tag === "new")} />
        <section ref={resultsRef} id="topup-games" className="topup-catalog" aria-labelledby="topup-games-title">
          <div className="topup-catalog-heading"><div><span className="topup-section-label">GAME CATALOG</span><h2 id="topup-games-title">{t("เลือกเกมที่ต้องการเติม")}</h2><p>{t("ค้นหาเกมโปรดของคุณได้ในที่เดียว")}</p></div><span className="topup-game-count" role="status" aria-live="polite">{t("พบ {{count}} เกม", { count: filteredGames.length })}</span></div>
          <div className="topup-finder">
            <form className="topup-finder-search" role="search" onSubmit={event => { event.preventDefault(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}>
              <MagnifyingGlassIcon aria-hidden="true" />
              <input type="search" aria-label={t("ค้นหาชื่อเกม")} placeholder={t("ค้นหาชื่อเกม เช่น Free Fire, VALORANT…")} value={query} onChange={event => setQuery(event.target.value)} enterKeyHint="search" />
              {query && <button type="button" className="topup-finder-clear" aria-label={t("ล้างคำค้นหา")} onClick={() => setQuery("")}><Cross2Icon /></button>}
            </form>
            <div className="topup-finder-row">
              <div className="topup-segment" role="group" aria-label={t("กรองแพลตฟอร์ม")}>
                {(["all", "Mobile", "PC Games", "Console"] as const).map(value => <button key={value} type="button" className={platform === value ? "selected" : ""} aria-pressed={platform === value} onClick={() => setPlatform(value)}>
                  {platform === value && <motion.span layoutId="topup-segment-thumb" className="topup-segment-thumb" transition={{ type: "spring", stiffness: 420, damping: 34 }} aria-hidden="true" />}
                  <span className="topup-segment-label">{value !== "all" && <PlatformIcon platform={value} />}{value === "all" ? t("ทั้งหมด") : value}</span>
                </button>)}
              </div>
              <div className="topup-finder-selects">
                <label className={`topup-chip-select${genre !== "all" ? " is-set" : ""}`}><span>{t("ประเภทเกม")}</span><select value={genre} onChange={event => setGenre(event.target.value)}><option value="all">{t("ทุกประเภท")}</option>{genres.map(value => <option key={value} value={value}>{value}</option>)}</select><ChevronDownIcon aria-hidden="true" /></label>
                <label className="topup-chip-select"><span>{t("เรียงตาม")}</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">{t("แนะนำ")}</option><option value="name">A–Z</option></select><ChevronDownIcon aria-hidden="true" /></label>
              </div>
            </div>
          </div>
          {hasFilters && <div className="topup-active-filters" role="group" aria-label={t("ตัวกรองที่ใช้อยู่")}>
            <span className="topup-active-count">{t("พบ {{count}} เกม", { count: filteredGames.length })}</span>
            {query.trim() && <button type="button" className="topup-filter-chip" onClick={() => setQuery("")} aria-label={`${t("ลบตัวกรอง")} “${query.trim()}”`}>“{query.trim()}”<Cross2Icon aria-hidden="true" /></button>}
            {platform !== "all" && <button type="button" className="topup-filter-chip" onClick={() => setPlatform("all")} aria-label={`${t("ลบตัวกรอง")} ${platform}`}>{platform}<Cross2Icon aria-hidden="true" /></button>}
            {genre !== "all" && <button type="button" className="topup-filter-chip" onClick={() => setGenre("all")} aria-label={`${t("ลบตัวกรอง")} ${genre}`}>{genre}<Cross2Icon aria-hidden="true" /></button>}
            <button type="button" className="topup-filter-clear-all" onClick={clearFilters}>{t("ล้างตัวกรอง")}</button>
          </div>}
          <div className="topup-games-grid"><AnimatePresence mode="popLayout">{filteredGames.map(game => <GameCard key={game.id} game={game} />)}</AnimatePresence></div>
          {!filteredGames.length && <div className="topup-empty"><MagnifyingGlassIcon /><h3>{t("ยังไม่พบเกมที่ตรงกับตัวกรอง")}</h3><p>{t("ลองเปลี่ยนคำค้นหาหรือเลือกแพลตฟอร์มอื่น")}</p><button className="pill" onClick={clearFilters}>{t("ล้างตัวกรอง")}</button></div>}
        </section>
      </main>
      <Footer onOpenDialog={setModal} />
      <ContactDialog title={modal} onClose={() => setModal("")} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={category => { setSearchOpen(false); if (category.platform === "Gift Card") { router.push("/cards"); return; } setQuery(""); setPlatform(category.platform); requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })); }} />
    </MotionConfig>
  );
}
