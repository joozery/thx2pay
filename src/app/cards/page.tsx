import { pageMetadata } from "@/i18n/pageMeta";
import CardsPage from "@/components/cards/CardsPage";

export const metadata = pageMetadata("/cards");
export default function Page() { return <CardsPage />; }
