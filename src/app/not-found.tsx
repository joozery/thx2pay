import type { Metadata } from "next";
import NotFoundPage from "@/components/info/NotFoundPage";

export const metadata: Metadata = { title: "ไม่พบหน้า (404) | THX2PAY", robots: { index: false } };

// Root 404: handles every unmatched URL and every notFound() call in the app.
export default function NotFound() {
  return <NotFoundPage />;
}
