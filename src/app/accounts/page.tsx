import { pageMetadata } from "@/i18n/pageMeta";
import AccountsPage from "@/components/accounts/AccountsPage";

export const metadata = pageMetadata("/accounts");
export default function Page() { return <AccountsPage />; }
