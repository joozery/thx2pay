"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowRightIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "@/components/flows/FlowShell";
import { useAuth } from "./AuthProvider";
import { accountGroups, accountGroupTitles } from "./accountMenu";
import AccountIcon from "./AccountIcon";
import { Avatar } from "./UserMenu";
import "./account.css";

export default function AccountPage() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, ready, logout } = useAuth();
  useEffect(() => { if (ready && !user) router.replace("/login"); }, [ready, user, router]);

  return <FlowShell>
    <div className="acct">
      <div className="acct-crumb" role="navigation" aria-label={t("เส้นทางหน้าเว็บ")}><Link href="/">{t("หน้าแรก")}</Link><ChevronRightIcon /><span>{t("บัญชีของฉัน")}</span></div>
      {ready && user && <div className="acct-layout">
        <aside className="acct-profile" aria-label={t("บัญชีของฉัน")}>
          <Avatar name={user.name} size={76} />
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          <div className="acct-balance"><span>{t("ยอดเงินคงเหลือ")}</span><b>฿0.00</b></div>
          <Link href="/wallet/topup" className="pill acct-topup">{t("เติมเงิน")}<ArrowRightIcon /></Link>
          <button type="button" className="acct-logout" onClick={() => { logout(); router.push("/"); }}><ExitIcon />{t("ออกจากระบบ")}</button>
        </aside>
        <div className="acct-groups">
          {accountGroups.map((group, index) => <section className="acct-group" key={index} aria-labelledby={`acct-g${index}`}>
            <h2 id={`acct-g${index}`}>{t(accountGroupTitles[index])}</h2>
            <div className="acct-items">{group.map(item => <Link key={item.label} href={item.href} className="acct-item"><span className="account-icon"><AccountIcon name={item.icon} /></span><span>{t(item.label)}</span><ChevronRightIcon /></Link>)}</div>
          </section>)}
        </div>
      </div>}
    </div>
  </FlowShell>;
}
