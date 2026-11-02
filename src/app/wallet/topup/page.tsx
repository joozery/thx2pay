import type { Metadata } from "next";
import WalletTopupFlow from "@/components/flows/WalletTopupFlow";

export const metadata: Metadata = { title: "กระเป๋าเงิน | THX2PAY", description: "จัดการกระเป๋าเงิน เลือกช่องทางเติมเงิน และตรวจสอบประวัติรายการ THX2PAY" };
export default function Page() { return <WalletTopupFlow />; }
