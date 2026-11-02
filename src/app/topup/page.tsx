import { pageMetadata } from "@/i18n/pageMeta";
import TopupPage from "@/components/topup/TopupPage";

export const metadata = pageMetadata("/topup");

export default function Page() {
  return <TopupPage />;
}
