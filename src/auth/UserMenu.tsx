"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { DropdownMenu } from "radix-ui";
import { ChevronDownIcon, ChevronRightIcon, ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import { accountGroups } from "./accountMenu";
import AccountIcon from "./AccountIcon";
import "./account.css";

export function Avatar({ name, size = 36 }: { name: string; size?: number }) {
  return <span className="avatar" style={{ width: size, height: size, fontSize: size * 0.42 }} aria-hidden="true">{(name[0] ?? "U").toUpperCase()}</span>;
}

export function AccountSummary({ name, email }: { name: string; email: string }) {
  const { t } = useI18n();
  return <>
    <div className="account-head"><Avatar name={name} size={48} /><div><strong>{name}</strong><small>{email}</small></div></div>
    <div className="account-balance"><span>{t("ยอดเงินคงเหลือ")}</span><b>฿0.00</b></div>
  </>;
}

export default function UserMenu() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, logout } = useAuth();
  if (!user) return null;
  return <>
    <button type="button" className="user-trigger user-trigger-mobile" aria-label={t("บัญชีของฉัน")} onClick={() => window.dispatchEvent(new Event("thx2pay-open-account"))}><Avatar name={user.name} /></button>
    <DropdownMenu.Root>
      <DropdownMenu.Trigger className="user-trigger user-trigger-desktop" aria-label={t("เมนูบัญชี")}><Avatar name={user.name} /><ChevronDownIcon /></DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className="account-dropdown" align="end" sideOffset={10} collisionPadding={16}>
          <AccountSummary name={user.name} email={user.email} />
          {accountGroups.map((group, index) => <div key={index}><DropdownMenu.Separator className="account-sep" />{group.map(item => <DropdownMenu.Item key={item.label} asChild><Link href={item.href} className="account-item"><span className="account-icon"><AccountIcon name={item.icon} /></span>{t(item.label)}<ChevronRightIcon /></Link></DropdownMenu.Item>)}</div>)}
          <DropdownMenu.Separator className="account-sep" />
          <DropdownMenu.Item className="account-item danger" onSelect={() => { logout(); router.push("/"); }}><span className="account-icon"><ExitIcon /></span>{t("ออกจากระบบ")}</DropdownMenu.Item>
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  </>;
}
