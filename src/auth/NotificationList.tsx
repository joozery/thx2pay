"use client";

import Link from "next/link";
import { BackpackIcon, BellIcon, CheckCircledIcon, ClockIcon, CrossCircledIcon, StarIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import type { AppNotification, NotificationType } from "./notifications";

const typeIcon: Record<NotificationType, typeof BellIcon> = { order: CheckCircledIcon, wallet: BackpackIcon, promo: StarIcon, system: BellIcon };

export default function NotificationList({ items, isRead, onOpen }: { items: AppNotification[]; isRead: (id: string) => boolean; onOpen: (item: AppNotification) => void }) {
  const { t } = useI18n();
  return <ul className="ntf-list">{items.map(item => {
    const Icon = item.type === "order" ? (item.tone === "pending" ? ClockIcon : item.tone === "cancelled" ? CrossCircledIcon : CheckCircledIcon) : typeIcon[item.type];
    const read = isRead(item.id);
    return <li key={item.id}>
      <Link href={item.href} className={`ntf-item ${item.type} ${item.tone}${read ? "" : " unread"}`} onClick={() => onOpen(item)}>
        <span className="ntf-icon" aria-hidden="true"><Icon /></span>
        <span className="ntf-copy"><strong>{t(item.title)}</strong><span>{t(item.text)}</span><small>{t(item.time)}</small></span>
        {!read && <span className="ntf-dot"><span className="ntf-sr">{t("ยังไม่อ่าน")}</span></span>}
      </Link>
    </li>;
  })}</ul>;
}
