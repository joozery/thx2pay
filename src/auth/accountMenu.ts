export type AccountItem = { label: string; href: string; icon: "user" | "edit" | "lock" | "history" | "uid" | "wallet" | "card" | "bell" | "gear" | "agent" | "help" };

export const accountGroups: AccountItem[][] = [
  [
    { label: "ดูโปรไฟล์", href: "/account", icon: "user" },
    { label: "แก้ไขข้อมูลส่วนตัว", href: "/account", icon: "edit" },
    { label: "ความปลอดภัย", href: "/account", icon: "lock" },
  ],
  [
    { label: "ประวัติการเติม", href: "/account", icon: "history" },
    { label: "UID ที่บันทึกไว้", href: "/account", icon: "uid" },
    { label: "ยอดเงิน / คูปอง", href: "/wallet/topup", icon: "wallet" },
    { label: "ช่องทางชำระเงิน", href: "/wallet/topup", icon: "card" },
  ],
  [
    { label: "การแจ้งเตือน", href: "/account", icon: "bell" },
    { label: "ตั้งค่า", href: "/account", icon: "gear" },
    { label: "ตัวแทนจำหน่าย", href: "/partner", icon: "agent" },
    { label: "ช่วยเหลือ", href: "/help", icon: "help" },
  ],
];

export const accountGroupTitles = ["ข้อมูลส่วนตัว", "การเติมเงิน", "ทั่วไป"];
