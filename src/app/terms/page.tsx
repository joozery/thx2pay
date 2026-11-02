import { pageMetadata } from "@/i18n/pageMeta";
import LegalPage from "@/components/info/LegalPage";
import { termsOfService } from "@/components/info/legalContent";

export const metadata = pageMetadata("/terms");
export default function Page() { return <LegalPage doc={termsOfService} />; }
