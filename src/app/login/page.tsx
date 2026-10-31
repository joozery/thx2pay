import type { Metadata } from "next";
import LoginFlow from "@/components/flows/LoginFlow";

export const metadata: Metadata = { title: "เข้าสู่ระบบ | THX2PAY" };
export default function Page() { return <LoginFlow />; }
