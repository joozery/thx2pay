"use client";

import { useMemo, useSyncExternalStore } from "react";

// Sample orders shown until the real order API exists (clearly labelled as examples in the UI).
export type OrderStatus = "complete" | "pending" | "cancelled";
export type Order = { id: string; game: string; item: string; image: string; amount: number; date: string; status: OrderStatus };
export const sampleOrders: Order[] = [
  { id: "DEMO-1004", game: "Garena RoV", item: "คูปอง 325 คูปอง", image: "/images/games/icons/rov.jpg", amount: 300, date: "02/11/2026 · 14:32", status: "complete" },
  { id: "DEMO-1003", game: "Free Fire", item: "เพชร 310 เพชร", image: "/images/games/icons/free-fire.png", amount: 100, date: "02/11/2026 · 12:15", status: "pending" },
  { id: "DEMO-1002", game: "Genshin Impact", item: "Genesis Crystals 300 + 30", image: "/images/games/icons/genshin-impact.png", amount: 179, date: "01/11/2026 · 19:40", status: "complete" },
  { id: "DEMO-1001", game: "PUBG MOBILE", item: "UC 325 UC", image: "/images/games/icons/pubg-mobile.png", amount: 150, date: "01/11/2026 · 10:08", status: "cancelled" },
];
export const statusLabels: Record<OrderStatus, string> = { complete: "สำเร็จแล้ว", pending: "กำลังดำเนินการ", cancelled: "ยกเลิก" };

// Browser-only stores (no member backend yet).
const changeEvent = "thx2pay-uids-change";
export function subscribeAccountStore(callback: () => void) {
  window.addEventListener(changeEvent, callback);
  window.addEventListener("storage", callback);
  return () => { window.removeEventListener(changeEvent, callback); window.removeEventListener("storage", callback); };
}
export function notifyAccountStore() { window.dispatchEvent(new Event(changeEvent)); }
function read(key: string) { try { return localStorage.getItem(key); } catch { return null; } }

export type SavedUID = { id: string; game: string; uid: string };
export function useSavedUIDs(email: string) {
  const key = `thx2pay-uids:${email}`;
  const raw = useSyncExternalStore(subscribeAccountStore, () => read(key), () => null);
  const items = useMemo<SavedUID[]>(() => {
    try {
      const parsed: unknown = JSON.parse(raw ?? "[]");
      return Array.isArray(parsed) ? parsed.filter((item): item is SavedUID => !!item && typeof item.id === "string" && typeof item.game === "string" && typeof item.uid === "string") : [];
    } catch { return []; }
  }, [raw]);
  function save(next: SavedUID[]) {
    try { localStorage.setItem(key, JSON.stringify(next)); notifyAccountStore(); return true; } catch { return false; }
  }
  return { items, save };
}

export function usePreferences(email: string) {
  const key = `thx2pay-notifications:${email}`;
  const raw = useSyncExternalStore(subscribeAccountStore, () => read(key), () => null);
  const prefs = useMemo<Record<string, boolean>>(() => {
    try { const value: unknown = JSON.parse(raw ?? "{}"); return value && typeof value === "object" && !Array.isArray(value) ? value as Record<string, boolean> : {}; } catch { return {}; }
  }, [raw]);
  function toggle(topic: string) {
    try { localStorage.setItem(key, JSON.stringify({ ...prefs, [topic]: !prefs[topic] })); notifyAccountStore(); return true; } catch { return false; }
  }
  return { prefs, toggle };
}
