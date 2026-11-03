import { pageMetadata } from "@/i18n/pageMeta";
import BoxesPage from "@/components/boxes/BoxesPage";

export const metadata = pageMetadata("/boxes");
export default function Page() { return <BoxesPage />; }
