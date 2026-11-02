import { pageMetadata } from "@/i18n/pageMeta";
import LoginFlow from "@/components/flows/LoginFlow";

export const metadata = pageMetadata("/login");
export default function Page() { return <LoginFlow />; }
