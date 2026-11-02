import { pageMetadata } from "@/i18n/pageMeta";
import ForgotPasswordFlow from "@/components/flows/ForgotPasswordFlow";

export const metadata = pageMetadata("/forgot-password");
export default function Page() { return <ForgotPasswordFlow />; }
