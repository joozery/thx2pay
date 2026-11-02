"use client";

import { useI18n } from "@/i18n/useI18n";

import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { MagnifyingGlassIcon, Cross2Icon, ArrowRightIcon, CounterClockwiseClockIcon, DashboardIcon, IdCardIcon, BackpackIcon, LightningBoltIcon, StarIcon, PersonIcon, QuestionMarkCircledIcon, ReaderIcon, EnvelopeClosedIcon, ClockIcon, AvatarIcon } from "@radix-ui/react-icons";
import type { Category } from "./categories";
import { OPEN_GAME_EVENT, clearRecent, groupLabels, groupOrder, popularGames, pushRecent, readRecent, searchItems, shortcuts, type PageIcon, type SearchItem } from "./search/searchIndex";
import "./search-dialog.css";

/*
  Site search (opened from the navbar).
  Two layouts share the same search logic:
    - "spotlight": centered glass panel, grouped list (default)
    - "sheet": full-width panel that drops from the navbar, results in columns
  Change DEFAULT_VARIANT to pick one. In development a small switch in the footer lets you compare both.
*/
export type SearchVariant = "spotlight" | "sheet";
const DEFAULT_VARIANT: SearchVariant = "spotlight";
const VARIANT_KEY = "thx2pay-search-variant";
const isDev = process.env.NODE_ENV !== "production";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** @deprecated The dialog now navigates by itself; kept so existing pages keep compiling. */
  onSelect?: (category: Category) => void;
};

const pageIcons: Record<PageIcon, typeof DashboardIcon> = { topup: DashboardIcon, card: IdCardIcon, wallet: BackpackIcon, partner: PersonIcon, premium: LightningBoltIcon, promo: StarIcon, news: ReaderIcon, help: QuestionMarkCircledIcon, uid: IdCardIcon, contact: EnvelopeClosedIcon, history: ClockIcon, account: AvatarIcon };

function Highlight({ text, query }: { text: string; query: string }) {
  const q = query.trim();
  const index = q ? text.toLocaleLowerCase().indexOf(q.toLocaleLowerCase()) : -1;
  if (index < 0) return <>{text}</>;
  return <>{text.slice(0, index)}<mark>{text.slice(index, index + q.length)}</mark>{text.slice(index + q.length)}</>;
}

function ItemArt({ item }: { item: SearchItem }) {
  if (item.kind === "page" && item.icon) { const Icon = pageIcons[item.icon]; return <span className="sd-art sd-art-icon" aria-hidden="true"><Icon /></span>; }
  if (item.kind === "premium") return <span className="sd-art sd-art-logo" style={{ background: item.color }} aria-hidden="true">{item.image && <Image src={item.image} alt="" width={22} height={22} unoptimized />}</span>;
  return <span className="sd-art" aria-hidden="true">{item.image && <Image src={item.image} alt="" width={44} height={44} />}</span>;
}

function readVariant(): SearchVariant {
  if (typeof window === "undefined" || !isDev) return DEFAULT_VARIANT;
  try { const saved = localStorage.getItem(VARIANT_KEY); return saved === "sheet" || saved === "spotlight" ? saved : DEFAULT_VARIANT; } catch { return DEFAULT_VARIANT; }
}

export default function SearchDialog({ open, onOpenChange }: SearchDialogProps) {
  const { t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);
  const [recent, setRecent] = useState<SearchItem[]>([]);
  const [variant, setVariant] = useState<SearchVariant>(readVariant);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchItems(query), [query]);
  const groups = useMemo(() => groupOrder.map(kind => ({ kind, items: results.filter(item => item.kind === kind) })).filter(group => group.items.length), [results]);
  // Keyboard order follows the visual order: with a query, the grouped results; without, recent + popular + shortcuts.
  const flat = useMemo(() => query.trim() ? groups.flatMap(group => group.items) : [...recent, ...popularGames, ...shortcuts], [groups, query, recent]);

  useEffect(() => { listRef.current?.querySelector(`[data-index="${active}"]`)?.scrollIntoView({ block: "nearest" }); }, [active]);

  function updateQuery(next: string) {
    setQuery(next);
    setActive(0);
  }

  function changeOpen(next: boolean) {
    if (!next) updateQuery("");
    onOpenChange(next);
  }

  function choose(item: SearchItem) {
    pushRecent(item);
    changeOpen(false);
    if (item.gameId && pathname === "/topup") window.dispatchEvent(new CustomEvent(OPEN_GAME_EVENT, { detail: item.gameId }));
    else router.push(item.href);
  }

  function onKey(event: KeyboardEvent<HTMLInputElement>) {
    if (!flat.length) return;
    if (event.key === "ArrowDown") { event.preventDefault(); setActive(index => (index + 1) % flat.length); }
    else if (event.key === "ArrowUp") { event.preventDefault(); setActive(index => (index - 1 + flat.length) % flat.length); }
    else if (event.key === "Enter") { event.preventDefault(); const item = flat[active]; if (item) choose(item); }
  }

  function switchVariant(next: SearchVariant) {
    setVariant(next);
    try { localStorage.setItem(VARIANT_KEY, next); } catch { /* preview only */ }
    inputRef.current?.focus();
  }

  const optionId = (index: number) => `${listId}-opt-${index}`;
  const option = (item: SearchItem, index: number, content: ReactNode, className = "sd-option") => {
    return <div key={`${item.id}-${index}`} id={optionId(index)} role="option" aria-selected={active === index} data-index={index} className={`${className}${active === index ? " active" : ""}`}
      onMouseMove={() => { if (active !== index) setActive(index); }} onMouseDown={event => event.preventDefault()} onClick={() => choose(item)}>{content}</div>;
  };
  const row = (item: SearchItem, index: number) => option(item, index, <><ItemArt item={item} /><span className="sd-text"><strong><Highlight text={t(item.title)} query={query} /></strong><small>{t(item.subtitle)}</small></span><ArrowRightIcon className="sd-go" aria-hidden="true" /></>);

  const sheet = variant === "sheet";
  const panelMotion = reduce
    ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
    : sheet
      ? { initial: { opacity: 0, y: -28 }, animate: { opacity: 1, y: 0 }, exit: { opacity: 0, y: -20, transition: { duration: 0.16, ease: "easeIn" as const } } }
      : { initial: { opacity: 0, y: -12, scale: 0.96 }, animate: { opacity: 1, y: 0, scale: 1 }, exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.14, ease: "easeIn" as const } } };
  const spring = reduce ? { duration: 0.12 } : { type: "spring" as const, stiffness: 420, damping: 34, mass: 0.8 };

  const emptyQuery = !query.trim();

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <AnimatePresence>
        {open && <Dialog.Portal forceMount>
          <Dialog.Overlay asChild forceMount><motion.div className="sd-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, transition: { duration: 0.15 } }} transition={{ duration: 0.2 }} /></Dialog.Overlay>
          <Dialog.Content forceMount id="site-search" className={`sd-frame sd-${variant}`} aria-describedby={undefined}
            onOpenAutoFocus={event => { event.preventDefault(); setRecent(readRecent()); setActive(0); inputRef.current?.focus(); }}
            onCloseAutoFocus={event => { event.preventDefault(); document.querySelector<HTMLButtonElement>('[aria-controls="site-search"]')?.focus({ preventScroll: true }); }}
            onPointerDown={event => { if (event.target === event.currentTarget) changeOpen(false); }}>
            <motion.div className="sd-panel" {...panelMotion} transition={spring}>
              <Dialog.Title className="sd-sr">{t("ค้นหา")}</Dialog.Title>
              <div className="sd-bar">
                <MagnifyingGlassIcon className="sd-bar-icon" aria-hidden="true" />
                <input ref={inputRef} type="text" role="combobox" aria-expanded={flat.length > 0} aria-controls={listId} aria-activedescendant={flat.length ? optionId(active) : undefined} aria-autocomplete="list" aria-label={t("ค้นหาเกม แอพ หรือบริการ")}
                  value={query} onChange={event => updateQuery(event.target.value)} onKeyDown={onKey} placeholder={t("ค้นหาเกม แอพพรีเมียม หรือบริการ…")} autoComplete="off" spellCheck={false} enterKeyHint="go" />
                {query && <button type="button" className="sd-clear" aria-label={t("ล้างคำค้นหา")} onClick={() => { updateQuery(""); inputRef.current?.focus(); }}><Cross2Icon /></button>}
                <Dialog.Close className="sd-esc" aria-label={t("ปิดการค้นหา")}><span className="sd-esc-key">Esc</span><Cross2Icon className="sd-esc-x" /></Dialog.Close>
              </div>

              <div ref={listRef} id={listId} role="listbox" aria-label={t("ผลการค้นหา")} className="sd-body">
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div key={emptyQuery ? "suggest" : results.length ? "results" : "empty"} initial={{ opacity: 0, y: reduce ? 0 : 4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.14 }} className={emptyQuery ? "sd-suggest" : "sd-results"}>
                    {emptyQuery ? <>
                      {recent.length > 0 && <section className="sd-group sd-recent">
                        <div className="sd-group-head"><span>{t("ค้นหาล่าสุด")}</span><button type="button" className="sd-text-btn" onMouseDown={event => event.preventDefault()} onClick={() => { clearRecent(); setRecent([]); setActive(0); }}>{t("ล้าง")}</button></div>
                        <div className="sd-chips">{recent.map((item, i) => option(item, i, <><CounterClockwiseClockIcon aria-hidden="true" />{t(item.title)}</>, "sd-chip"))}</div>
                      </section>}
                      <section className="sd-group sd-popular">
                        <div className="sd-group-head"><span>{t("เกมยอดนิยม")}</span></div>
                        <div className="sd-tiles">{popularGames.map((item, i) => option(item, recent.length + i, <><ItemArt item={item} /><span>{item.title}</span></>, "sd-tile"))}</div>
                      </section>
                      <section className="sd-group sd-shortcuts">
                        <div className="sd-group-head"><span>{t("ทางลัด")}</span></div>
                        <div className="sd-shortcut-list">{shortcuts.map((item, i) => row(item, recent.length + popularGames.length + i))}</div>
                      </section>
                    </> : results.length ? groups.map((group, g) => <section key={group.kind} className="sd-group" aria-label={t(groupLabels[group.kind])}>
                      <div className="sd-group-head"><span>{t(groupLabels[group.kind])}</span><span className="sd-count">{group.items.length}</span></div>
                      {group.items.map((item, i) => row(item, groups.slice(0, g).reduce((sum, prev) => sum + prev.items.length, 0) + i))}
                    </section>) : <div className="sd-empty">
                      <span className="sd-empty-icon" aria-hidden="true"><MagnifyingGlassIcon /></span>
                      <strong>{t("ไม่พบ “{{query}}”", { query: query.trim() })}</strong>
                      <p>{t("ลองพิมพ์ชื่อเกม เช่น Free Fire, ROV หรือคำว่า บัตร, พรีเมียม")}</p>
                      <div className="sd-chips">{popularGames.slice(0, 4).map(item => <button key={item.id} type="button" className="sd-chip" onClick={() => { updateQuery(item.title); inputRef.current?.focus(); }}>{item.title}</button>)}</div>
                    </div>}
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="sd-foot">
                <span className="sd-keys"><kbd>↑</kbd><kbd>↓</kbd>{t("เลือก")}<kbd>Enter</kbd>{t("เปิด")}<kbd>Esc</kbd>{t("ปิด")}</span>
                {isDev && <span className="sd-variant" role="group" aria-label="Search layout preview">
                  <span>{t("รูปแบบ")}</span>
                  <button type="button" aria-pressed={variant === "spotlight"} onClick={() => switchVariant("spotlight")}>A · Spotlight</button>
                  <button type="button" aria-pressed={variant === "sheet"} onClick={() => switchVariant("sheet")}>B · Sheet</button>
                </span>}
              </div>
            </motion.div>
          </Dialog.Content>
        </Dialog.Portal>}
      </AnimatePresence>
    </Dialog.Root>
  );
}
