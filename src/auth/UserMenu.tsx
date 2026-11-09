"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { ChevronDownIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import { accountExtras, accountNav } from "./accountMenu";
import AccountIcon from "./AccountIcon";
import "./account.css";

// Users have no uploaded photo yet; `photo` swaps the initial for the default mascot picture.
export const defaultAvatarSrc = "/images/avatar-default.webp";

export function Avatar({ name, size = 36, photo = false }: { name: string; size?: number; photo?: boolean }) {
  if (photo) return <span className="avatar avatar-photo" style={{ width: size, height: size }} aria-hidden="true"><Image src={defaultAvatarSrc} alt="" width={size} height={size} /></span>;
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{(name[0] ?? "U").toUpperCase()}</span>;
}

export function AccountSummary({ name, email, photo = false }: { name: string; email: string; photo?: boolean }) {
  const { t, money } = useI18n();
  return <>
    <div className="account-head"><Avatar name={name} size={48} photo={photo} /><div><strong>{name}</strong><small>{email}</small></div></div>
    <div className="account-balance"><span>{t("ยอดเงินคงเหลือ")}</span><b>{money(0, { fixed: true })}</b></div>
  </>;
}

export default function UserMenu() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, logout } = useAuth();
  if (!user) return null;
  return <>
    <button type="button" className="user-trigger user-trigger-mobile" aria-label={t("บัญชีของฉัน")} onClick={() => window.dispatchEvent(new Event("thx2pay-open-account"))}><Avatar name={user.name} photo /></button>
    <DropdownMenu.Root modal={false}>
      <DropdownMenu.Trigger className="user-trigger user-trigger-desktop" aria-label={t("เมนูบัญชี")}><Avatar name={user.name} size={32} /><span className="user-trigger-name">{user.name}</span><ChevronDownIcon /></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="account-dropdown" align="end" sideOffset={10} collisionPadding={16}>
          <AccountSummary name={user.name} email={user.email} />
          <DropdownMenu.Separator className="account-sep" />
          {accountNav.map(item => <DropdownMenu.Item key={item.key} asChild><Link href={item.href} className="account-item"><span className="account-icon"><AccountIcon name={item.icon} /></span>{t(item.label)}<ChevronRightIcon /></Link></DropdownMenu.Item>)}
          <DropdownMenu.Separator className="account-sep" />
          {accountExtras.map(item => <DropdownMenu.Item key={item.key} asChild><Link href={item.href} className="account-item subtle"><span className="account-icon"><AccountIcon name={item.icon} /></span>{t(item.label)}<ChevronRightIcon /></Link></DropdownMenu.Item>)}
          <DropdownMenu.Separator className="account-sep" />
          <DropdownMenu.Item className="account-item danger" onSelect={() => { logout(); router.push("/"); }}><span className="account-icon"><ExitIcon /></span>{t("ออกจากระบบ")}</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </>;
}
