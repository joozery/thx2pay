"use client";

import { useMemo, useSyncExternalStore } from "react";
import { notifyAccountStore, subscribeAccountStore } from "./accountData";

// Sample inbox until the notification API exists (labelled as examples in the UI).
export type NotificationType = "order" | "wallet" | "promo" | "system";
export type NotificationTone = "success" | "pending" | "cancelled" | "info";
export type AppNotification = { id: string; type: NotificationType; tone: NotificationTone; title: string; text: string; time: string; href: string };

export const sampleNotifications: AppNotification[] = [
  { id: "n-1004", type: "order", tone: "success", title: "เติม Garena RoV สำเร็จ", text: "คูปอง 325 คูปอง เข้าบัญชีเรียบร้อย · DEMO-1004", time: "10 นาทีที่แล้ว", href: "/account/orders" },
  { id: "n-1003", type: "order", tone: "pending", title: "Free Fire กำลังดำเนินการ", text: "เพชร 310 เพชร กำลังส่งเข้าเกม โดยปกติไม่เกิน 5 นาที", time: "2 ชั่วโมงที่แล้ว", href: "/account/orders" },
  { id: "n-promo", type: "promo", tone: "info", title: "โปรโมชั่นใหม่: เติมคุ้มกว่า", text: "รับสิทธิพิเศษเมื่อเติมเกมที่ร่วมรายการ", time: "เมื่อวาน", href: "/promotions" },
  { id: "n-1001", type: "order", tone: "cancelled", title: "คำสั่งซื้อ PUBG MOBILE ถูกยกเลิก", text: "UC 325 UC · DEMO-1001 หากมีข้อสงสัย ติดต่อทีมงานได้", time: "1 พ.ย.", href: "/account/orders" },
  { id: "n-welcome", type: "system", tone: "info", title: "ยินดีต้อนรับสู่ THX2PAY", text: "บันทึก UID ไว้ ครั้งหน้าเติมเกมได้เร็วขึ้น", time: "1 พ.ย.", href: "/account/uids" },
];

function readKey(key: string) { try { return localStorage.getItem(key); } catch { return null; } }

export function useNotifications(email: string | undefined) {
  const key = `thx2pay-notifications-read:${email ?? "guest"}`;
  const raw = useSyncExternalStore(subscribeAccountStore, () => readKey(key), () => null);
  const readIds = useMemo(() => { try { const v: unknown = JSON.parse(raw ?? "[]"); return new Set(Array.isArray(v) ? v.filter((id): id is string => typeof id === "string") : []); } catch { return new Set<string>(); } }, [raw]);
  const items = email ? sampleNotifications : [];
  const unread = items.filter(item => !readIds.has(item.id)).length;
  function write(ids: Set<string>) { try { localStorage.setItem(key, JSON.stringify([...ids])); notifyAccountStore(); } catch { /* storage blocked */ } }
  return {
    items,
    unread,
    isRead: (id: string) => readIds.has(id),
    markRead: (id: string) => { if (!readIds.has(id)) write(new Set([...readIds, id])); },
    markAllRead: () => write(new Set(items.map(item => item.id))),
  };
}
