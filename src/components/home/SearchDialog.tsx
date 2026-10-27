"use client";

import { useI18n } from "@/i18n/useI18n";

import { useRef, useState, type KeyboardEvent } from "react";
import { Dialog } from "radix-ui";
import { motion } from "motion/react";
import { MagnifyingGlassIcon, Cross2Icon, ArrowRightIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import { allCategories, matchesCategory, type Category } from "./categories";
import { platforms } from "./types";
import "./search-dialog.css";

type SearchDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (category: Category) => void;
};

export default function SearchDialog({ open, onOpenChange, onSelect }: SearchDialogProps) {
  const { t } = useI18n();
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef(false);
  const results = allCategories.filter(category => matchesCategory(category, query));

  function changeOpen(next: boolean) {
    setQuery("");
    selectedRef.current = false;
    onOpenChange(next);
  }

  function select(category: Category) {
    selectedRef.current = true;
    setQuery("");
    onSelect(category);
  }

  function navigateResults(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const next = index + (event.key === "ArrowDown" ? 1 : -1);
    const buttons = resultsRef.current?.querySelectorAll<HTMLButtonElement>(".search-result");
    if (next < 0) inputRef.current?.focus();
    else buttons?.[Math.min(next, results.length - 1)]?.focus();
  }

  return (
    <Dialog.Root open={open} onOpenChange={changeOpen}>
      <Dialog.Portal>
        <Dialog.Overlay asChild><motion.div className="search-dialog-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} /></Dialog.Overlay>
        <Dialog.Content
          id="site-search"
          className="search-dialog"
          onOpenAutoFocus={event => { event.preventDefault(); selectedRef.current = false; inputRef.current?.focus(); }}
          onCloseAutoFocus={event => {
            event.preventDefault();
            if (selectedRef.current) {
              document.getElementById("categories")?.focus({ preventScroll: true });
            } else {
              document.querySelector<HTMLButtonElement>('[aria-controls="site-search"]')?.focus({ preventScroll: true });
            }
          }}
        >
          <div className="search-dialog-heading">
            <div><Dialog.Title>{t("ค้นหาความสนุกของคุณ")}</Dialog.Title><Dialog.Description>{t("ค้นหาหมวดสินค้า หรือเลือกแพลตฟอร์มที่ต้องการ")}</Dialog.Description></div>
            <Dialog.Close className="icon-button search-dialog-close" aria-label={t("ปิดการค้นหา")}><Cross2Icon /></Dialog.Close>
          </div>
          <form role="search" className="search-dialog-form" onSubmit={event => { event.preventDefault(); if (results[0]) select(results[0]); }}>
            <MagnifyingGlassIcon aria-hidden="true" />
            <input ref={inputRef} type="search" value={query} onChange={event => setQuery(event.target.value)} aria-label={t("ค้นหาหมวดหรือแพลตฟอร์ม")} placeholder={t("เช่น เติมเกม, บัตรของขวัญ, Mobile…")} autoComplete="off" onKeyDown={event => { if (event.key === "ArrowDown") { event.preventDefault(); resultsRef.current?.querySelector<HTMLButtonElement>(".search-result")?.focus(); } }} />
            {query && <button type="button" className="icon-button" aria-label={t("ล้างคำค้นหา")} onClick={() => { setQuery(""); inputRef.current?.focus(); }}><Cross2Icon /></button>}
            <button type="submit" className="search-submit" aria-label={t("ค้นหาผลลัพธ์แรก")} disabled={!results.length}><ArrowRightIcon /></button>
          </form>
          <div className="search-platforms" aria-label={t("ค้นหาตามแพลตฟอร์ม")}>
            {platforms.map(platform => <button key={platform} type="button" className={query === platform ? "selected" : ""} onClick={() => { setQuery(platform); inputRef.current?.focus(); }}>{platform}</button>)}
          </div>
          <div className="search-result-heading" role="status" aria-live="polite"><span>{t(query.trim() ? "ผลการค้นหา" : "หมวดหมู่ทั้งหมด")}</span><span>{results.length}{" "}{t("หมวดหมู่")}</span></div>
          <div ref={resultsRef} className="search-results">
            {results.map((category, index) => <button key={`${category.platform}-${category.label}`} className="search-result" onClick={() => select(category)} onKeyDown={event => navigateResults(event, index)}>
              <Image src={category.image} alt="" width={72} height={44} className="search-result-image" />
              <span className="search-result-text"><strong>{t(category.label)}</strong><small>{category.platform}</small></span>
              <ArrowRightIcon aria-hidden="true" />
            </button>)}
            {!results.length && <div className="search-empty"><MagnifyingGlassIcon aria-hidden="true" /><h3>{t("ไม่พบหมวดหมู่ที่ค้นหา")}</h3><p>{t("ลองใช้คำว่า เติมเกม, บัตร หรือชื่อแพลตฟอร์ม")}</p><button onClick={() => { setQuery(""); inputRef.current?.focus(); }}>{t("แสดงหมวดหมู่ทั้งหมด")}</button></div>}
          </div>
          <div className="search-dialog-hint"><span>{t("↑ ↓ เลือกผลลัพธ์ · Enter เปิดหมวดหมู่")}</span><span>{t("Esc ปิด")}</span></div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
