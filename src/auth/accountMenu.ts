export type AccountItem = { label: string; href: string; icon: "user" | "edit" | "lock" | "history" | "uid" | "wallet" | "card" | "bell" | "gear" | "agent" | "help" };

export const accountGroups: AccountItem[][] = [
  [
    { label: "ดูโปรไฟล์", href: "/account/profile", icon: "user" },
    { label: "แก้ไขข้อมูลส่วนตัว", href: "/account/edit", icon: "edit" },
    { label: "ความปลอดภัย", href: "/account/security", icon: "lock" },
  ],
  [
    { label: "ประวัติการเติม", href: "/account/history", icon: "history" },
    { label: "UID ที่บันทึกไว้", href: "/account/uids", icon: "uid" },
    { label: "ยอดเงิน / คูปอง", href: "/wallet/topup", icon: "wallet" },
    { label: "ช่องทางชำระเงิน", href: "/wallet/topup", icon: "card" },
  ],
  [
    { label: "การแจ้งเตือน", href: "/account/notifications", icon: "bell" },
    { label: "ตั้งค่า", href: "/account/settings", icon: "gear" },
    { label: "ตัวแทนจำหน่าย", href: "/partner", icon: "agent" },
    { label: "ช่วยเหลือ", href: "/help", icon: "help" },
  ],
];

export const accountGroupTitles = ["ข้อมูลส่วนตัว", "การเติมเงิน", "ทั่วไป"];

export const accountSections = {
  profile: "ดูโปรไฟล์", edit: "แก้ไขข้อมูลส่วนตัว", security: "ความปลอดภัย",
  history: "ประวัติการเติม", uids: "UID ที่บันทึกไว้", notifications: "การแจ้งเตือน", settings: "ตั้งค่า",
} as const;
export type AccountSection = keyof typeof accountSections;
