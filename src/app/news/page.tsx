import { pageMetadata } from "@/i18n/pageMeta";
import NewsPage from "@/components/news/NewsPage";

export const metadata = pageMetadata("/news");
export default function Page() { return <NewsPage />; }
