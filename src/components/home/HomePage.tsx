"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "./Navbar";
import SearchDialog from "./SearchDialog";
import type { Category } from "./categories";
import HeroSection from "./HeroSection";
import PromotionBanners from "./PromotionBanners";
import PlatformTabs from "./PlatformTabs";
import CategorySection from "./CategorySection";
import HomeShowcase from "./HomeShowcase";
import BenefitsSection from "./BenefitsSection";
import PartnerSection from "./PartnerSection";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import ContactDialog from "./ContactDialog";
import type { Platform } from "./types";

export default function HomePage() {
  const router = useRouter();
  const [slide, setSlide] = useState(1);
  const [tab, setTab] = useState<Platform>("Mobile");
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");

  function selectGiftCards() {
    router.push("/cards");
  }

  function toggleSearch() {
    setSearch(value => !value);
  }

  function selectSearchResult(category: Category) {
    if (category.platform === "Gift Card") { setSearch(false); router.push("/cards"); return; }
    if (category.label === "เติมเกม") { setSearch(false); router.push("/topup"); return; }
    setTab(category.platform);
    setQuery(category.label);
    setSearch(false);
    requestAnimationFrame(() => document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" }));
  }

  function selectPlatform(platform: Platform) {
    setQuery("");
    setTab(platform);
  }

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25, ease: "easeOut" }}>
      <Navbar onToggleSearch={toggleSearch} searchOpen={search} />
      <main id="top" className="container">


        <HeroSection slide={slide} onSlideChange={setSlide} onSelectGiftCards={selectGiftCards} />


        <PromotionBanners />

        <PlatformTabs tab={tab} onTabChange={selectPlatform} />

        <CategorySection tab={tab} query={query} onTabChange={selectPlatform} onQueryChange={setQuery} onOpenDialog={setModal} />

        <HomeShowcase />

        <BenefitsSection />

        <PartnerSection />

        <FAQSection />

      </main>
      <Footer onOpenDialog={setModal} />
      <SearchDialog open={search} onOpenChange={setSearch} onSelect={selectSearchResult} />
      <ContactDialog title={modal} onClose={() => setModal("")} />
    </MotionConfig>
  );
}
