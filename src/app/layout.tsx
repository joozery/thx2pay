import type { Metadata } from "next";
import { Suspense } from "react";
import { Noto_Sans_Thai, Geist_Mono } from "next/font/google";
import "./globals.css";
import "./theme.css";
import "./responsive.css";
import "./liquid-glass.css";
import "flag-icons/css/flag-icons.min.css";
import I18nProvider from "@/i18n/I18nProvider";
import { siteDescription, siteTitle } from "@/i18n/pageMeta";
import AuthProvider from "@/auth/AuthProvider";
import AccountSheet from "@/auth/AccountSheet";
import MobileTabBar from "@/auth/MobileTabBar";
import CookieConsent from "@/components/consent/CookieConsent";
import GlobalSocialRail from "@/components/home/GlobalSocialRail";

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

export const metadata: Metadata = { title: siteTitle, description: siteDescription };

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="th"
      data-theme="dark"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${notoSansThai.variable} ${geistMono.variable} antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: `(function(){try{document.documentElement.dataset.theme=localStorage.getItem("thx2pay-theme")==="light"?"light":"dark"}catch(e){}})();` }} />
      </head>
      <body className={`${notoSansThai.className} min-h-screen`}><I18nProvider><AuthProvider>{children}<Suspense fallback={null}><MobileTabBar /></Suspense><AccountSheet /><GlobalSocialRail /><CookieConsent /></AuthProvider></I18nProvider></body>
    </html>
  );
}
