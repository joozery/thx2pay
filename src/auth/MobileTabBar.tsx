"use client";

import Link from "next/link";
import { useSyncExternalStore } from "react";
import { usePathname } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { PersonIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { homeLink, isTopupPath, navIcons, premiumLink, promotionsLink, topupLinks, type NavLink } from "@/components/home/navLinks";
import { useAuth } from "./AuthProvider";
import { Avatar } from "./UserMenu";
import "./account.css";
import "@/components/home/nav-dropdown.css";
import "./mobile-tab-bar.css";

const subscribeToHydration = () => () => {};
const clientHydrated = () => true;
const serverHydrated = () => false;

const isActive = (pathname: string, href: string) => href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

function TabLink({ link, pathname }: { link: NavLink; pathname: string }) {
  const { t } = useI18n();
  const Icon = navIcons[link.target];
  const active = isActive(pathname, link.href);
  return <Link href={link.href} className={active ? "active" : ""} aria-current={active ? "page" : undefined}>
    <span className="app-tab-icon"><Icon /></span><span className="app-tab-label">{t(link.label)}</span>
  </Link>;
}

// Bottom bar on phones: the five things customers use most.
// หน้าแรก | เติมเงิน (menu) | พรีเมียม | โปรโมชั่น | บัญชี — help lives in the account sheet and the top menu.
export default function MobileTabBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const auth = useAuth();
  // This Suspense boundary may hydrate after the provider has loaded browser storage.
  // Keep its initial auth UI identical to the server's signed-out markup.
  const hydrated = useSyncExternalStore(subscribeToHydration, clientHydrated, serverHydrated);
  const user = hydrated ? auth.user : null;
  const accountActive = pathname === "/account" || pathname.startsWith("/account/") || pathname === "/login";
  const topupActive = isTopupPath(pathname);
  const TopupIcon = navIcons.wallet;

  return <nav className="app-tab-bar" aria-label={t("เมนูล่างบนมือถือ")}>
    <TabLink link={homeLink} pathname={pathname} />
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className={`app-tab-trigger${topupActive ? " active" : ""}`} aria-current={topupActive ? "page" : undefined}>
        <span className="app-tab-icon"><TopupIcon /></span><span className="app-tab-label">{t("เติมเงิน")}</span>
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="nav-dropdown app-tab-menu" side="top" align="center" sideOffset={14} collisionPadding={12}>
          <p className="app-tab-menu-title">{t("เติมเงิน")}</p>
          {topupLinks.map(link => {
            const Icon = navIcons[link.target];
            const active = isActive(pathname, link.href);
            return <DropdownMenu.Item key={link.target} asChild>
              <Link href={link.href} className={`nav-dropdown-item${active ? " active" : ""}`} aria-current={active ? "page" : undefined}>
                <span className="nav-dropdown-icon"><Icon /></span>
                <span className="nav-dropdown-text"><b>{t(link.label)}</b><small>{t(link.description)}</small></span>
              </Link>
            </DropdownMenu.Item>;
          })}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
    <TabLink link={premiumLink} pathname={pathname} />
    <TabLink link={promotionsLink} pathname={pathname} />
    {user
      ? <button type="button" className={accountActive ? "active" : ""} aria-current={accountActive ? "page" : undefined} onClick={() => window.dispatchEvent(new Event("thx2pay-open-account"))}><span className="app-tab-icon"><Avatar name={user.name} size={24} photo /></span><span className="app-tab-label">{t("บัญชี")}</span></button>
      : <Link href="/login" className={accountActive ? "active" : ""} aria-current={accountActive ? "page" : undefined}><span className="app-tab-icon"><PersonIcon /></span><span className="app-tab-label">{t("บัญชี")}</span></Link>}
  </nav>;
}
