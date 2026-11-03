import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import CheckoutFlow from "@/components/checkout/CheckoutFlow";
import { appProducts, findAppProduct } from "@/components/checkout/catalog";
import { productPageMeta } from "@/i18n/pageMeta";

type Props = { params: Promise<{ app: string }> };

export function generateStaticParams() {
  return appProducts.map(product => ({ app: product.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = productPageMeta(`/premium/${(await params).app}`);
  return meta ? { title: meta.title, description: meta.description } : {};
}

async function Checkout({ params }: Props) {
  const product = findAppProduct((await params).app);
  if (!product) notFound();
  return <CheckoutFlow product={product} />;
}

// Listed products are prerendered; an unknown id resolves at request time and shows the 404 page.
export default function Page({ params }: Props) {
  return <Suspense fallback={<main className="container" style={{ minHeight: "70vh" }} aria-busy="true" />}><Checkout params={params} /></Suspense>;
}
