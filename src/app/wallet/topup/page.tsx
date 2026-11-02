import { pageMetadata } from "@/i18n/pageMeta";
import WalletTopupFlow from "@/components/flows/WalletTopupFlow";

export const metadata = pageMetadata("/wallet/topup");
export default function Page() { return <WalletTopupFlow />; }
