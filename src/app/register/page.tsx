import { pageMetadata } from "@/i18n/pageMeta";
import RegisterFlow from "@/components/flows/RegisterFlow";

export const metadata = pageMetadata("/register");
export default function Page() { return <RegisterFlow />; }
