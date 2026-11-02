import { pageMetadata } from "@/i18n/pageMeta";
import LegalPage from "@/components/info/LegalPage";
import { privacyPolicy } from "@/components/info/legalContent";

export const metadata = pageMetadata("/privacy");
export default function Page() { return <LegalPage doc={privacyPolicy} />; }
