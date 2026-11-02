"use client";

import { useEffect, useRef, type ReactNode } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import FlowShell from "@/components/flows/FlowShell";
import { useAuth } from "./AuthProvider";
import { Avatar } from "./UserMenu";
import AccountIcon from "./AccountIcon";
import { accountExtras, accountNav, type AccountNavKey } from "./accountMenu";
import { useNotifications } from "./notifications";
import "./notifications.css";
import "./account.css";
import "./member-pages.css";
import "./account-shell.css";

/*
  Layout for every account page.
  Desktop: sticky sidebar on the left (who you are + 5 destinations + help + logout).
  Phone: the same 5 destinations as a sticky, swipeable tab row under the header.
*/
export default function AccountShell({ active, children }: { active: AccountNavKey; children: ReactNode }) {
  const { t } = useI18n();
  const router = useRouter();
  const { user, logout } = useAuth();
  const activePage = active === "wallet" ? "wallet" : null;
  const navRef = useRef<HTMLElement>(null);
  const { unread } = useNotifications(user?.email);
  // Phone: the tab row scrolls sideways; bring the current tab into view.
  useEffect(() => {
    const nav = navRef.current, current = nav?.querySelector<HTMLElement>("a.active");
    if (nav && current && nav.scrollWidth > nav.clientWidth) nav.scrollLeft = current.offsetLeft - (nav.clientWidth - current.offsetWidth) / 2;
  }, [active, user]);
  return <FlowShell activePage={activePage}>
    <div className={`acct acct-shell${user ? "" : " no-user"}`}>
      {user && <aside className="acct-side" aria-label={t("เมนูบัญชี")}>
        <Link href="/account" className="acct-side-user"><Avatar name={user.name} size={44} /><span><strong>{user.name}</strong><small>{user.email}</small></span></Link>
        <nav ref={navRef} className="acct-side-nav" aria-label={t("เมนูบัญชี")}>
          {accountNav.map(item => <Link key={item.key} href={item.href} className={active === item.key ? "active" : ""} aria-current={active === item.key ? "page" : undefined}>
            <span className="acct-side-icon"><AccountIcon name={item.icon} /></span><span className="acct-side-text"><b>{t(item.label)}</b><small>{t(item.hint ?? "")}</small></span>
            {item.key === "notifications" && unread > 0 && <span className="acct-side-badge" aria-label={t("ยังไม่อ่าน {{count}} รายการ", { count: unread })}>{unread}</span>}
          </Link>)}
        </nav>
        <div className="acct-side-extra">
          {accountExtras.map(item => <Link key={item.key} href={item.href}><AccountIcon name={item.icon} />{t(item.label)}</Link>)}
          <button type="button" className="acct-side-logout" onClick={() => { logout(); router.push("/"); }}><ExitIcon />{t("ออกจากระบบ")}</button>
        </div>
      </aside>}
      <div className="acct-main">{children}</div>
    </div>
  </FlowShell>;
}
