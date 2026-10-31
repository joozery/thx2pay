import type { Metadata } from "next";
import AccountPage from "@/auth/AccountPage";

export const metadata: Metadata = { title: "บัญชีของฉัน | THX2PAY" };
export default function Page() { return <AccountPage />; }
