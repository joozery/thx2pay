import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import AccountPage from "@/auth/AccountPage";
import FlowShell from "@/components/flows/FlowShell";
import { accountSections, legacyAccountRoutes, type AccountSection } from "@/auth/accountMenu";

export function generateStaticParams() {
  return [...Object.keys(accountSections), ...Object.keys(legacyAccountRoutes)].map(section => ({ section }));
}

type AccountPageProps = { params: Promise<{ section: string }> };

async function AccountSectionContent({ params }: AccountPageProps) {
  const { section } = await params;
  // Pages that were merged (profile, edit, security, notifications, history) redirect to their new home.
  if (Object.hasOwn(legacyAccountRoutes, section)) redirect(legacyAccountRoutes[section]);
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
