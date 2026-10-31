import type { Metadata } from "next";
import TopupPage from "@/components/topup/TopupPage";

export const metadata: Metadata = {
  title: "เติมเกมออนไลน์ | THX2PAY",
  description: "เลือกเกมที่ต้องการเติม ค้นหา Free Fire, VALORANT และ PUBG MOBILE พร้อมข้อมูลและคำแนะนำจาก THX2PAY",
};

export default function Page() {
  return <TopupPage />;
}
