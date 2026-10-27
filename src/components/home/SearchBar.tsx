"use client";

import { useI18n } from "@/i18n/useI18n";

import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

export default function SearchBar({ query, onQueryChange }: { query: string; onQueryChange: (value: string) => void }) {
  const { t } = useI18n();

  return (
    <form id="site-search" role="search" className="search-bar" onSubmit={e => { e.preventDefault(); document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }); }}>
      <MagnifyingGlassIcon />
      <input autoFocus aria-label={t("ค้นหาเกมหรือสินค้า")} placeholder={t("ค้นหาเกมหรือสินค้า…")} value={query} onChange={e => onQueryChange(e.target.value)} />
      <button className="pill">{t("ค้นหา")}</button>
    </form>
  );
}
