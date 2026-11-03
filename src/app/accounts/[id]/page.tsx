import type { Metadata } from "next";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import AccountDetail from "@/components/accounts/AccountDetail";
import { findAccount, gameAccounts } from "@/components/accounts/accounts";
import { productPageMeta } from "@/i18n/pageMeta";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return gameAccounts.map(account => ({ id: account.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const meta = productPageMeta(`/accounts/${(await params).id}`);
  return meta ? { title: meta.title, description: meta.description } : {};
}

async function Detail({ params }: Props) {
  const account = findAccount((await params).id);
  if (!account) notFound();
  return <AccountDetail account={account} />;
}

// Listed accounts are prerendered; an unknown id resolves at request time and shows the 404 page.
export default function Page({ params }: Props) {
  return <Suspense fallback={<main className="container" style={{ minHeight: "70vh" }} aria-busy="true" />}><Detail params={params} /></Suspense>;
}
