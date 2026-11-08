"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useI18n } from "./useI18n";
import { brandSuffix, findPageMeta, siteDescription, siteTitle } from "./pageMeta";

// Server metadata is always Thai; this keeps the tab title and meta description in the visitor's language.
export default function DocumentMeta() {
  const pathname = usePathname();
  const { t } = useI18n();
  const page = findPageMeta(pathname);
  const title = page ? t(page.name, page.values) + brandSuffix : t(siteTitle);
  const description = t(page?.description ?? siteDescription, page?.values);

  useEffect(() => {
    function apply() {
      // The 404 page marks itself so the tab says "not found", even under a known prefix like /topup/<unknown>.
      const notFound = document.querySelector('[data-page="not-found"]');
      const nextTitle = notFound ? t("ไม่พบหน้า (404)") + brandSuffix : title;
      if (document.title !== nextTitle) document.title = nextTitle;
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta && meta.content !== description) meta.content = description;
    }
    apply();
    // Next.js writes the (Thai) route metadata into <head> after navigation; re-apply when it does.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["content"] });
    return () => observer.disconnect();
  }, [title, description, t]);

  return null;
}
