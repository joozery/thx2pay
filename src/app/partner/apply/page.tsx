import { pageMetadata } from "@/i18n/pageMeta";
import PartnerApplyFlow from "@/components/flows/PartnerApplyFlow";

export const metadata = pageMetadata("/partner/apply");
export default function Page() { return <PartnerApplyFlow />; }
