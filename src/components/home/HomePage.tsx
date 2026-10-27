"use client";

import { useState } from "react";
import { MotionConfig } from "motion/react";
import Navbar from "./Navbar";
import SearchDialog from "./SearchDialog";
import type { Category } from "./categories";
import HeroSection from "./HeroSection";
import SocialFollowRail from "./SocialFollowRail";
import PlatformTabs from "./PlatformTabs";
import CategorySection from "./CategorySection";
import BenefitsSection from "./BenefitsSection";
import PartnerSection from "./PartnerSection";
import FAQSection from "./FAQSection";
import Footer from "./Footer";
import ContactDialog from "./ContactDialog";
import type { Platform, NavTarget } from "./types";

export default function HomePage() {
  const [slide, setSlide] = useState(1);
  const [tab, setTab] = useState<Platform>("Mobile");
  const [search, setSearch] = useState(false);
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState("");

  function selectGiftCards() {
    setQuery("");
    setTab("Gift Card");
    document.getElementById("categories")?.scrollIntoView({ behavior: "smooth" });
  }

  function navigate(target: NavTarget) {
    setSearch(false);
    setQuery("");
    if (target === "home") {
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    if (target === "games") setTab("Mobile");
    if (target === "cards") setTab("Gift Card");
    if (target === "promotions") setSlide(0);
    const section = target === "games" || target === "cards" ? "categories" : target === "help" ? "about" : target;
    document.getElementById(section)?.scrollIntoView({ behavior: "smooth" });
  }

  function toggleSearch() {
    setSearch(value => !value);
  }

  function selectSearchResult(category: Category) {
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
      <Navbar onOpenDialog={setModal} onToggleSearch={toggleSearch} onNavigate={navigate} searchOpen={search} />
      <main id="top" className="container">


        <HeroSection slide={slide} onSlideChange={setSlide} onSelectGiftCards={selectGiftCards} />

        <SocialFollowRail onOpenDialog={setModal} />

        <PlatformTabs tab={tab} onTabChange={selectPlatform} />

        <CategorySection tab={tab} query={query} onTabChange={selectPlatform} onQueryChange={setQuery} onOpenDialog={setModal} />

        <BenefitsSection />

        <PartnerSection onOpenDialog={setModal} />

        <FAQSection />

      </main>
      <Footer onOpenDialog={setModal} />
      <SearchDialog open={search} onOpenChange={setSearch} onSelect={selectSearchResult} />
      <ContactDialog title={modal} onClose={() => setModal("")} />
    </MotionConfig>
  );
}
