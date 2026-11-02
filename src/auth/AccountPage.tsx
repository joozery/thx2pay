"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import type { AccountSection } from "./accountMenu";
import AccountShell from "./AccountShell";
import AccountDetails from "./AccountDetails";
import AccountDashboard from "./AccountDashboard";

export default function AccountPage({ section }: { section?: AccountSection }) {
  const { t } = useI18n();
  const router = useRouter();
  const { user, ready } = useAuth();
  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);
  return <AccountShell active={section ?? "overview"}>
    {ready && user
      ? section ? <AccountDetails key={`${user.email}:${section}`} section={section} user={user} /> : <AccountDashboard user={user} />
      : <div className="member-loading" role="status">{t("กำลังโหลดข้อมูลบัญชี")}</div>}
  </AccountShell>;
}
