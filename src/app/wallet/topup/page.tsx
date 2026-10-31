import type { Metadata } from "next";
import WalletTopupFlow from "@/components/flows/WalletTopupFlow";

export const metadata: Metadata = { title: "เติมเงิน | THX2PAY" };
export default function Page() { return <WalletTopupFlow />; }
