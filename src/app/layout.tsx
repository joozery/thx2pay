import type { Metadata } from "next";
import { Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./responsive.css";
import "flag-icons/css/flag-icons.min.css";
import I18nProvider from "@/i18n/I18nProvider";

const notoSansThai = Noto_Sans_Thai({
  variable: "--font-noto-sans-thai",
  subsets: ["thai", "latin"],
  weight: "variable",
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "THX2PAY | เติมเกมออนไลน์ รวดเร็ว ปลอดภัย",
  description: "เติมเกมออนไลน์ บัตรเติมเงิน ไอดีเกม และไอเทม ครบทุกความสนุกกับ THX2PAY",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      data-theme="dark"
      suppressHydrationWarning
      className={`${notoSansThai.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem("thx2pay-theme")==="light"?"light":"dark"}catch(e){}})();` }} />
      </head>
      <body className={`${notoSansThai.className} min-h-screen`}><I18nProvider>{children}</I18nProvider></body>
    </html>
  );
}
