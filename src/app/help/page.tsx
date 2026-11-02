import { pageMetadata } from "@/i18n/pageMeta";
import HelpPage from "@/components/help/HelpPage";

export const metadata = pageMetadata("/help");
export default function Page() { return <HelpPage />; }
