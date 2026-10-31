"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { AnimatePresence, MotionConfig } from "motion/react";
import { MagnifyingGlassIcon, Cross2Icon, ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import PlatformIcon from "@/components/home/PlatformIcon";
import GameCard from "./GameCard";
import GameDetailsDialog from "./GameDetailsDialog";
import FeaturedGames from "./FeaturedGames";
import { games, genres, type Game, type GamePlatform } from "./games";
import "./topup.css";
import "./topup-v2.css";

type PlatformFilter = "all" | GamePlatform;

export default function TopupPage() {
  const { t, language } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [platform, setPlatform] = useState<PlatformFilter>("all");
  const [genre, setGenre] = useState("all");
  const [sort, setSort] = useState("popular");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const words = query.trim().toLocaleLowerCase().split(/\s+/).filter(Boolean);
  const filteredGames = games.filter(game => (platform === "all" || game.platforms.includes(platform)) && (genre === "all" || game.genre === genre) && words.every(word => `${game.name} ${game.publisher ?? ""} ${game.aliases}`.toLocaleLowerCase().includes(word)));
  if (sort === "name") filteredGames.sort((a, b) => a.name.localeCompare(b.name));

  useEffect(() => {
    document.title = language === "en" ? "Game top-ups | THX2PAY" : "เติมเกมออนไลน์ | THX2PAY";
  }, [language]);

  function clearFilters() { setQuery(""); setPlatform("all"); setGenre("all"); }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: "easeOut" }}>
      <Navbar activePage="games" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
      <main className="container topup-page" id="top">
        <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("เติมเกม")}</span></nav>
        <PageHero id="topup-title" eyebrow="THX2PAY GAME TOP-UP" title="เติมเกมโปรดของคุณ" accent="ความสนุกเริ่มได้ที่นี่" description="เลือกเกมที่ต้องการ แล้วค้นหาแพ็กเกจที่เหมาะกับคุณ" image="/images/games/free-fire-official-hd.jpg" imageAlt="Free Fire" imagePosition="60% center" cta={{ label: "เลือกเกม", href: "#topup-games" }} />
        <FeaturedGames tag="recommended" games={games.filter(game => game.tag === "recommended")} onSelect={setSelectedGame} />
        <FeaturedGames tag="new" games={games.filter(game => game.tag === "new")} onSelect={setSelectedGame} />
        <section ref={resultsRef} id="topup-games" className="topup-catalog" aria-labelledby="topup-games-title">
          <div className="topup-catalog-heading"><div><span className="topup-section-label">GAME CATALOG</span><h2 id="topup-games-title">{t("เลือกเกมที่ต้องการเติม")}</h2><p>{t("ค้นหาเกมโปรดของคุณได้ในที่เดียว")}</p></div><span className="topup-game-count" role="status" aria-live="polite">{t("พบ {{count}} เกม", { count: filteredGames.length })}</span></div>
          <form className="topup-search" role="search" onSubmit={event => { event.preventDefault(); resultsRef.current?.scrollIntoView({ behavior: "smooth" }); }}><MagnifyingGlassIcon aria-hidden="true" /><input type="search" aria-label={t("ค้นหาชื่อเกม")} placeholder={t("ค้นหาชื่อเกม เช่น Free Fire, VALORANT…")} value={query} onChange={event => setQuery(event.target.value)} />{query && <button type="button" className="icon-button" aria-label={t("ล้างคำค้นหา")} onClick={() => setQuery("")}><Cross2Icon /></button>}<button className="pill">{t("ค้นหา")}</button></form>
          <div className="topup-toolbar"><div className="topup-platform-filters" role="group" aria-label={t("กรองแพลตฟอร์ม")}>{(["all", "Mobile", "PC Games", "Console"] as const).map(value => <button key={value} className={platform === value ? "selected" : ""} aria-pressed={platform === value} onClick={() => setPlatform(value)}>{value !== "all" && <PlatformIcon platform={value} />}{value === "all" ? t("ทั้งหมด") : value}</button>)}</div><div className="topup-selects"><label><span>{t("ประเภทเกม")}</span><select value={genre} onChange={event => setGenre(event.target.value)}><option value="all">{t("ทุกประเภท")}</option>{genres.map(value => <option key={value} value={value}>{value}</option>)}</select></label><label><span>{t("เรียงตาม")}</span><select value={sort} onChange={event => setSort(event.target.value)}><option value="popular">{t("แนะนำ")}</option><option value="name">A–Z</option></select></label></div></div>
          <div className="topup-games-grid"><AnimatePresence mode="popLayout">{filteredGames.map(game => <GameCard key={game.id} game={game} onSelect={setSelectedGame} />)}</AnimatePresence></div>
          {!filteredGames.length && <div className="topup-empty"><MagnifyingGlassIcon /><h3>{t("ยังไม่พบเกมที่ตรงกับตัวกรอง")}</h3><p>{t("ลองเปลี่ยนคำค้นหาหรือเลือกแพลตฟอร์มอื่น")}</p><button className="pill" onClick={clearFilters}>{t("ล้างตัวกรอง")}</button></div>}
          {(query || platform !== "all" || genre !== "all") && filteredGames.length > 0 && <button className="topup-clear" onClick={clearFilters}>{t("ล้างตัวกรอง")}<Cross2Icon /></button>}
        </section>
      </main>
      <Footer onOpenDialog={setModal} />
      <GameDetailsDialog game={selectedGame} onClose={() => setSelectedGame(null)} />
      <ContactDialog title={modal} onClose={() => setModal("")} />
      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={category => { setSearchOpen(false); if (category.platform === "Gift Card") { router.push("/cards"); return; } setQuery(""); setPlatform(category.platform); requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth" })); }} />
    </MotionConfig>
  );
}
