import { pageMetadata } from "@/i18n/pageMeta";
import AboutPage from "@/components/info/AboutPage";

export const metadata = pageMetadata("/about");
export default function Page() { return <AboutPage />; }
