// One source of truth for every account menu (sidebar, navbar dropdown, mobile sheet).
// 6 main destinations; everything that used to be split across duplicate pages now lives in one of these.
export type AccountIconName = "home" | "user" | "edit" | "lock" | "history" | "uid" | "wallet" | "card" | "bell" | "gear" | "agent" | "help" | "display";
export type AccountItem = { key: AccountNavKey | "help" | "partner"; label: string; href: string; icon: AccountIconName; hint?: string };
export type AccountNavKey = "overview" | "orders" | "wallet" | "notifications" | "uids" | "settings";

export const accountNav: (AccountItem & { key: AccountNavKey })[] = [
  { key: "overview", label: "ภาพรวม", href: "/account", icon: "home", hint: "ยอดเงิน รายการล่าสุด และทางลัด" },
  { key: "orders", label: "คำสั่งซื้อ", href: "/account/orders", icon: "history", hint: "ประวัติการเติมและสถานะ" },
  { key: "wallet", label: "กระเป๋าเงิน", href: "/wallet/topup", icon: "wallet", hint: "เติมเงินและช่องทางชำระเงิน" },
  { key: "notifications", label: "การแจ้งเตือน", href: "/account/notifications", icon: "bell", hint: "สถานะคำสั่งซื้อและข่าวสาร" },
  { key: "uids", label: "UID ของฉัน", href: "/account/uids", icon: "uid", hint: "ไอดีเกมที่บันทึกไว้" },
  { key: "settings", label: "ตั้งค่าบัญชี", href: "/account/settings", icon: "gear", hint: "ข้อมูลส่วนตัว รหัสผ่าน การแจ้งเตือน" },
];

export const accountExtras: AccountItem[] = [
  { key: "help", label: "ช่วยเหลือ", href: "/help", icon: "help" },
  { key: "partner", label: "สมัครตัวแทนจำหน่าย", href: "/partner", icon: "agent" },
];

// Pages under /account/[section]
export const accountSections = { orders: "คำสั่งซื้อ", notifications: "การแจ้งเตือน", uids: "UID ของฉัน", settings: "ตั้งค่าบัญชี" } as const;
export type AccountSection = keyof typeof accountSections;

// Old URLs keep working and land on the merged page.
export const legacyAccountRoutes: Record<string, string> = {
  profile: "/account",
  edit: "/account/settings#profile",
  security: "/account/settings#security",
  history: "/account/orders",
};

export const settingsSections = [
  { id: "profile", label: "ข้อมูลส่วนตัว", icon: "user" },
  { id: "security", label: "ความปลอดภัย", icon: "lock" },
  { id: "notifications", label: "การแจ้งเตือน", icon: "bell" },
  { id: "display", label: "การแสดงผล", icon: "display" },
] as const;
