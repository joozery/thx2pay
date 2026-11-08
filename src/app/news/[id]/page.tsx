import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import NewsPage from "@/components/news/NewsPage";
import { findNewsArticle, newsArticles } from "@/components/news/data";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return newsArticles.map(({ id }) => ({ id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = findNewsArticle((await params).id);
  if (!article) return { title: "ไม่พบบทความ | THX2PAY" };
  return { title: `${article.title} | THX2PAY`, description: article.excerpt };
}

async function Detail({ params }: Props) {
  const article = findNewsArticle((await params).id);
  if (!article) notFound();
  return <NewsPage article={article} />;
}

export default function Page({ params }: Props) {
  return <Suspense fallback={<main className="container" style={{ minHeight: "70vh" }} aria-busy="true" />}><Detail params={params} /></Suspense>;
}
