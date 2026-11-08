import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import { cardProducts, findCardProduct } from "@/components/checkout/catalog";
import { productPageMeta } from "@/i18n/pageMeta";

type Props = { params: Promise<{ game: string }> };

export function generateStaticParams() {
  return cardProducts.map(product => ({ game: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = productPageMeta(`/cards/${(await params).game}`);
  return meta ? { title: meta.title, description: meta.description } : {};
}

async function Checkout({ params }: Props) {
  const product = findCardProduct((await params).game);
  if (!product) notFound();
  return <CheckoutFlow product={product} />;
}

// Listed cards are prerendered; an unknown id resolves at request time and shows the 404 page.
export default function Page({ params }: Props) {
  return <Suspense fallback={<main className="container" style={{ minHeight: "70vh" }} aria-busy="true" />}><Checkout params={params} /></Suspense>;
}
