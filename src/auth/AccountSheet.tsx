"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Dialog } from "radix-ui";
import { ChevronRightIcon, Cross2Icon, ExitIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import { accountGroups } from "./accountMenu";
import AccountIcon from "./AccountIcon";
import { AccountSummary } from "./UserMenu";
import "./account.css";

export const openAccountEvent = "thx2pay-open-account";

// Mobile account menu: a pop-up sheet opened from the header avatar or the bottom "บัญชี" tab.
export default function AccountSheet() {
  const { t } = useI18n();
  const router = useRouter();
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const show = () => setOpen(true);
    window.addEventListener(openAccountEvent, show);
    return () => window.removeEventListener(openAccountEvent, show);
  }, []);

  if (!user) return null;
  return <Dialog.Root open={open} onOpenChange={setOpen}>
    <Dialog.Portal>
      <Dialog.Overlay className="sheet-overlay" />
      <Dialog.Content className="account-sheet" aria-describedby={undefined}>
        <div className="sheet-top"><Dialog.Title>{t("บัญชีของฉัน")}</Dialog.Title><Dialog.Close className="icon-button" aria-label={t("ปิด")}><Cross2Icon /></Dialog.Close></div>
        <div className="sheet-body">
          <AccountSummary name={user.name} email={user.email} />
          {accountGroups.map((group, index) => <div key={index}><div className="account-sep" />{group.map(item => <Link key={item.label} href={item.href} className="account-item" onClick={() => setOpen(false)}><span className="account-icon"><AccountIcon name={item.icon} /></span>{t(item.label)}<ChevronRightIcon /></Link>)}</div>)}
          <div className="account-sep" />
          <button className="account-item danger" onClick={() => { setOpen(false); logout(); router.push("/"); }}><span className="account-icon"><ExitIcon /></span>{t("ออกจากระบบ")}</button>
        </div>
      </Dialog.Content>
    </Dialog.Portal>
  </Dialog.Root>;
}
