"use client";

import { useState } from "react";
import Link from "next/link";
import { Popover } from "radix-ui";
import { BellIcon, GearIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import { useAuth } from "./AuthProvider";
import { useNotifications } from "./notifications";
import NotificationList from "./NotificationList";
import "./notifications.css";

// Navbar bell: unread count + quick inbox. Full list lives at /account/notifications.
export default function NotificationBell() {
  const { t } = useI18n();
  const { user } = useAuth();
  const { items, unread, isRead, markRead, markAllRead } = useNotifications(user?.email);
  const [open, setOpen] = useState(false);
  const [onlyUnread, setOnlyUnread] = useState(false);
  if (!user) return null;
  const shown = (onlyUnread ? items.filter(item => !isRead(item.id)) : items).slice(0, 5);
  return <Popover.Root open={open} onOpenChange={setOpen}>
    <Popover.Trigger className="icon-button ntf-bell" aria-label={unread ? t("การแจ้งเตือน ยังไม่อ่าน {{count}} รายการ", { count: unread }) : t("การแจ้งเตือน")}>
      <BellIcon />{unread > 0 && <span className="ntf-badge" aria-hidden="true">{unread > 9 ? "9+" : unread}</span>}
    </Popover.Trigger>
    <Popover.Portal>
      <Popover.Content className="ntf-panel" align="end" sideOffset={10} collisionPadding={12}>
        <div className="ntf-head">
          <h2>{t("การแจ้งเตือน")}</h2>
          <button type="button" className="ntf-text-btn" disabled={!unread} onClick={markAllRead}>{t("อ่านทั้งหมด")}</button>
        </div>
        <div className="ntf-filter" role="group" aria-label={t("แสดง")}>
          <button type="button" aria-pressed={!onlyUnread} onClick={() => setOnlyUnread(false)}>{t("ทั้งหมด")}</button>
          <button type="button" aria-pressed={onlyUnread} onClick={() => setOnlyUnread(true)}>{t("ยังไม่อ่าน")}{unread > 0 && <span>{unread}</span>}</button>
        </div>
        {shown.length ? <NotificationList items={shown} isRead={isRead} onOpen={item => { markRead(item.id); setOpen(false); }} />
          : <p className="ntf-empty">{t(onlyUnread ? "อ่านครบทุกรายการแล้ว" : "ยังไม่มีการแจ้งเตือน")}</p>}
        <p className="ntf-sample">{t("ตัวอย่างการแจ้งเตือน ยังไม่ใช่ข้อมูลจริง")}</p>
        <div className="ntf-foot">
          <Link href="/account/settings#notifications" onClick={() => setOpen(false)}><GearIcon />{t("ตั้งค่า")}</Link>
          <Link href="/account/notifications" className="ntf-all" onClick={() => setOpen(false)}>{t("ดูทั้งหมด")}</Link>
        </div>
      </Popover.Content>
    </Popover.Portal>
  </Popover.Root>;
}
