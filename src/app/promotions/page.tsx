import type { Metadata } from "next";
import PromotionsPage from "@/components/promotions/PromotionsPage";

export const metadata: Metadata = { title: "โปรโมชั่น | THX2PAY", description: "ติดตามข่าวสารและสิทธิพิเศษจาก THX2PAY" };
export default function Page() { return <PromotionsPage />; }
