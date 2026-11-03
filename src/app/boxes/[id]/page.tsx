import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import BoxDetail from "@/components/boxes/BoxDetail";
import { findBox, mysteryBoxes } from "@/components/boxes/boxes";
import { productPageMeta } from "@/i18n/pageMeta";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return mysteryBoxes.map(box => ({ id: box.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = productPageMeta(`/boxes/${(await params).id}`);
  return meta ? { title: meta.title, description: meta.description } : {};
}

async function Detail({ params }: Props) {
  const box = findBox((await params).id);
  if (!box) notFound();
  return <BoxDetail box={box} />;
}

// Listed boxes are prerendered; an unknown id resolves at request time and shows the 404 page.
export default function Page({ params }: Props) {
  return <Suspense fallback={<main className="container" style={{ minHeight: "70vh" }} aria-busy="true" />}><Detail params={params} /></Suspense>;
}
