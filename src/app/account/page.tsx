import { pageMetadata } from "@/i18n/pageMeta";
import AccountPage from "@/auth/AccountPage";

export const metadata = pageMetadata("/account");
export default function Page() { return <AccountPage />; }
