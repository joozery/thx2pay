import { pageMetadata } from "@/i18n/pageMeta";
import PromotionsPage from "@/components/promotions/PromotionsPage";

export const metadata = pageMetadata("/promotions");
export default function Page() { return <PromotionsPage />; }
