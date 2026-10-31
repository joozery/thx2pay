import type { Metadata } from "next";
import HelpPage from "@/components/help/HelpPage";

export const metadata: Metadata = { title: "ช่วยเหลือ | THX2PAY", description: "คำถามที่พบบ่อยและช่องทางติดต่อทีมงาน THX2PAY" };
export default function Page() { return <HelpPage />; }
