"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ChevronRightIcon, Cross2Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import { games, type Game } from "@/components/topup/games";
import type { Category } from "@/components/home/categories";
import "@/components/topup/game-card.css";
import "./cards.css";

// Example UI prices until the actual card catalog is connected.
const samplePrices = [100, 300, 500, 1000] as const;
type SelectedCard = { game: Game; price: number; quantity: number };

export default function CardsPage() {
  const { t } = useI18n();
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [selectedGame, setSelectedGame] = useState<Game | null>(null);
  const [selectedPrice, setSelectedPrice] = useState<number>(samplePrices[0]);
  const [quantity, setQuantity] = useState(1);
  const [selection, setSelection] = useState<SelectedCard[]>([]);
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const filteredGames = games.filter(game => `${game.name} ${game.aliases}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  function openGame(game: Game) {
    setSelectedPrice(samplePrices[0]);
    setQuantity(1);
    setSelectedGame(game);
  }

  function addSelection(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!selectedGame || !samplePrices.includes(selectedPrice as typeof samplePrices[number])) return;
    setSelection(items => [...items, { game: selectedGame, price: selectedPrice, quantity }]);
    setSelectedGame(null);
    requestAnimationFrame(() => document.getElementById("cards-selection")?.scrollIntoView({ behavior: "smooth", block: "nearest" }));
  }

  return <>
    <Navbar activePage="cards" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container cards-page" id="top">
      <nav className="cards-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("บัตรเติมเงิน")}</span></nav>
      <PageHero id="cards-title" eyebrow="DIGITAL CARDS & CODES" title="บัตรเติมเงิน" accent="เลือกความสนุกได้ง่าย ๆ" description="เลือกบัตรเติมเกมจากเกมที่คุณชอบ" image="/images/games/category-topup.webp" imageAlt="บัตรเติมเงินและเกม" cta={{ label: "เลือกบัตรเกม", href: "#cards-catalog" }} />

      <section className="cards-catalog" id="cards-catalog" aria-labelledby="cards-catalog-title">
        <div className="cards-catalog-heading"><div><span className="cards-kicker">GAME CARDS</span><h2 id="cards-catalog-title">{t("เลือกบัตรเติมเกม")}</h2><p>{t("เลือกเกมและราคาบัตรที่ต้องการ")}</p></div><span className="cards-count">{t("พบ {{count}} เกม", { count: filteredGames.length })}</span></div>
        <label className="cards-search"><MagnifyingGlassIcon aria-hidden="true" /><span className="sr-only">{t("ค้นหาชื่อเกม")}</span><input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder={t("ค้นหาชื่อเกม")} />{query && <button type="button" aria-label={t("ล้างคำค้นหา")} onClick={() => setQuery("")}><Cross2Icon /></button>}</label>
        <div className="cards-game-grid">{filteredGames.map(game => <div className="gc" key={game.id}><button className="gc-button" type="button" onClick={() => openGame(game)} aria-label={`${t("เลือกซื้อบัตร")} ${game.name}`}>
          <span className="gc-art"><Image src={game.icon} alt="" fill sizes="(max-width: 600px) 44vw, (max-width: 1000px) 28vw, 220px" style={{ objectFit: "cover" }} />{game.tag && <span className={`gc-tag ${game.tag}`}>{t(game.tag === "new" ? "มาใหม่" : "เกมแนะนำ")}</span>}</span>
          <span className="gc-info"><span className="gc-text"><b>{game.name}</b><span className="gc-price"><small>{t("เริ่มต้น")}</small><strong>฿{samplePrices[0]}</strong><em>{t("ตัวอย่าง")}</em></span></span><ChevronRightIcon aria-hidden="true" /></span>
        </button></div>)}</div>
        {!filteredGames.length && <p className="cards-empty">{t("ไม่พบเกมที่ค้นหา")}</p>}
      </section>

      {selection.length > 0 && <section className="cards-selection" id="cards-selection" aria-labelledby="cards-selection-title"><div><span className="cards-kicker">YOUR SELECTION</span><h2 id="cards-selection-title">{t("บัตรที่เลือก")}</h2><p>{t("ระบบชำระเงินสำหรับบัตรเกมยังไม่เปิดใช้งาน รายการนี้ยังไม่ใช่คำสั่งซื้อ")}</p><strong className="cards-selection-total">{t("ยอดรวมตัวอย่าง")}: ฿{selection.reduce((sum, item) => sum + item.price * item.quantity, 0).toLocaleString()}</strong></div><ul>{selection.map((item, index) => <li key={`${item.game.id}-${index}`}><Image src={item.game.icon} alt="" width={48} height={48} /><span><strong>{item.game.name}</strong><small>฿{item.price.toLocaleString()} × {item.quantity} = ฿{(item.price * item.quantity).toLocaleString()}</small></span><button type="button" aria-label={`${t("ลบ")} ${item.game.name}`} onClick={() => setSelection(items => items.filter((_, itemIndex) => itemIndex !== index))}><Cross2Icon /></button></li>)}</ul></section>}
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
    <Dialog.Root open={!!selectedGame} onOpenChange={open => { if (!open) setSelectedGame(null); }}><Dialog.Portal><Dialog.Overlay className="dialog-overlay" /><Dialog.Content className="dialog cards-dialog">{selectedGame && <><Dialog.Close className="dialog-close icon-button" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close><div className="cards-dialog-head"><Image src={selectedGame.icon} alt="" width={76} height={76} /><div><span className="cards-kicker">GAME CARD</span><Dialog.Title>{selectedGame.name}</Dialog.Title><Dialog.Description>{t("เลือกราคาบัตรที่กำหนดไว้และจำนวนที่ต้องการ")}</Dialog.Description></div></div><form onSubmit={addSelection}><fieldset className="cards-price-field"><legend>{t("เลือกราคาบัตร")} <small>({t("ตัวอย่าง")})</small></legend><div className="cards-price-options">{samplePrices.map(price => <label key={price} className={selectedPrice === price ? "selected" : ""}><input type="radio" name="card-price" value={price} checked={selectedPrice === price} onChange={() => setSelectedPrice(price)} /><span>฿{price.toLocaleString()}</span></label>)}</div></fieldset><label>{t("จำนวน")}<input type="number" min="1" max="99" value={quantity} onChange={event => setQuantity(Math.max(1, Math.min(99, Number(event.target.value) || 1)))} required /></label><div className="cards-dialog-total"><span>{t("ยอดรวมตัวอย่าง")}</span><strong>฿{(selectedPrice * quantity).toLocaleString()}</strong></div><button type="submit" className="pill">{t("เพิ่มในรายการที่เลือก")}</button></form></>}</Dialog.Content></Dialog.Portal></Dialog.Root>
  </>;
}
