"use client";

import { useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import SearchDialog from "@/components/home/SearchDialog";
import "./flows.css";
import "./flow-fixes.css";

export default function FlowShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  return <>
    <Navbar activePage={null} onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container flow-page">{children}</main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={category => { setSearchOpen(false); router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories"); }} />
  </>;
}
