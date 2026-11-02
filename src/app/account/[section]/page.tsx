import { Suspense } from "react";
import { notFound } from "next/navigation";
import AccountPage from "@/auth/AccountPage";
import FlowShell from "@/components/flows/FlowShell";
import { accountSections, type AccountSection } from "@/auth/accountMenu";

export function generateStaticParams() {
  return Object.keys(accountSections).map(section => ({ section }));
}

type AccountPageProps = { params: Promise<{ section: string }> };

async function AccountSectionContent({ params }: AccountPageProps) {
  const { section } = await params;
  if (!Object.hasOwn(accountSections, section)) notFound();
  return <AccountPage section={section as AccountSection} />;
}

export default function Page({ params }: AccountPageProps) {
  return (
    <Suspense fallback={<FlowShell><div role="status" style={{ minHeight: 360, display: "grid", placeItems: "center" }}>กำลังโหลดข้อมูลบัญชี</div></FlowShell>}>
      <AccountSectionContent params={params} />
    </Suspense>
  );
}
