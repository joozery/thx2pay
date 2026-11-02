"use client";

import { useState, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRightIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import type { NavTarget } from "@/components/home/types";
import "./info.css";

// Shared frame for the footer pages (privacy, terms, about, contact).
export default function InfoShell({ crumb, activePage = null, children }: { crumb: string; activePage?: NavTarget | null; children: ReactNode }) {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  return <>
    <Navbar activePage={activePage} onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container info-page" id="top">
      <nav className="info-crumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon aria-hidden="true" /><span>{t(crumb)}</span></nav>
      {children}
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={category => { setSearchOpen(false); router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories"); }} />
  </>;
}
