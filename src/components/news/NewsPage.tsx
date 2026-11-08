"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { newsArticles, type NewsArticle } from "./data";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, ClockIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import Navbar from "@/components/home/Navbar";
import Footer from "@/components/home/Footer";
import ContactDialog from "@/components/home/ContactDialog";
import PageHero from "@/components/home/PageHero";
import SearchDialog from "@/components/home/SearchDialog";
import type { Category } from "@/components/home/categories";
import "@/components/topup/topup.css";
import "./news.css";

export default function NewsPage({ article }: { article?: NewsArticle }) {
  const { t } = useI18n();
  const router = useRouter();
  const [modal, setModal] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  function selectSearchResult(category: Category) {
    setSearchOpen(false);
    router.push(category.platform === "Gift Card" ? "/cards" : category.label === "เติมเกม" ? "/topup" : "/#categories");
  }

  return <>
    <Navbar activePage="news" onToggleSearch={() => setSearchOpen(value => !value)} searchOpen={searchOpen} />
    <main className="container topup-page news-page" id="top">
      <nav className="topup-breadcrumb" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon />{article ? <><Link href="/news">{t("ข่าวสาร")}</Link><ChevronRightIcon /><span aria-current="page">{t(article.title)}</span></> : <span aria-current="page">{t("ข่าวสาร")}</span>}</nav>
      {article ? <article className="news-detail" aria-labelledby="article-title">
        <header className="news-detail-header">
          <span className="news-category">{t(article.category)}</span>
          <h1 id="article-title">{t(article.title)}</h1>
          <p className="news-intro">{t(article.excerpt)}</p>
          <ArticleMeta article={article} /><p className="news-author">THX2PAY Editorial</p>
        </header>
        <div className="news-cover"><Image src={article.image} alt={t(article.title)} fill sizes="(max-width: 900px) 100vw, 860px" priority /></div>
        <div className="news-prose">{article.sections.map(section => <section key={section.title}><h2>{t(section.title)}</h2><p>{t(section.body)}</p></section>)}</div>
        <div className="news-detail-footer"><Link href="/news" className="pill">{t("กลับไปหน้าข่าวสาร")}</Link><Link href="/help">{t("ต้องการความช่วยเหลือ")}<ArrowRightIcon /></Link></div>
      </article> : <PageHero id="news-title" eyebrow="THX2PAY NEWS" title="ข่าวสาร" accent="อัปเดตล่าสุดจาก THX2PAY" description="รวมบทความ คู่มือเติมเกม และเคล็ดลับการใช้งานจาก THX2PAY" image="/images/hero-lion.webp" imageAlt="มาสคอต THX2PAY พร้อมของขวัญ" cta={{ label: "อ่านบทความ", href: "#news-articles" }} />}
      <section className="news-section" id="news-articles" aria-labelledby="news-list-title">
        <div className="news-section-heading"><div><span className="news-eyebrow">{article ? "KEEP READING" : "THX2PAY JOURNAL"}</span><h2 id="news-list-title">{t(article ? "บทความที่เกี่ยวข้อง" : "บทความล่าสุด")}</h2></div><span>{t("บทความ")} {article ? 3 : newsArticles.length}</span></div>
        <div className="news-grid">{(article ? [...newsArticles.filter(item => item.id !== article.id && item.category === article.category), ...newsArticles.filter(item => item.id !== article.id && item.category !== article.category)].slice(0, 3) : newsArticles).map(item => <article className="news-card" key={item.id}>
          <Link href={`/news/${item.id}`} className="news-card-link">
            <div className="news-card-image"><Image src={item.image} alt="" fill sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 33vw" /></div>
            <div className="news-card-body"><span className="news-category">{t(item.category)}</span><h3>{t(item.title)}</h3><p>{t(item.excerpt)}</p><ArticleMeta article={item} /><span className="news-read">{t("อ่านบทความ")}<ArrowRightIcon /></span></div>
          </Link>
        </article>)}</div>
      </section>
    </main>
    <Footer onOpenDialog={setModal} />
    <ContactDialog title={modal} onClose={() => setModal("")} />
    <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} onSelect={selectSearchResult} />
  </>;
}

function ArticleMeta({ article }: { article: NewsArticle }) {
  const { t } = useI18n();
  return <div className="news-meta"><time dateTime={article.date}>{article.date.split("-").reverse().join(" / ")}</time><span><ClockIcon aria-hidden="true" />{article.readMinutes} {t("นาที")}</span></div>;
}
