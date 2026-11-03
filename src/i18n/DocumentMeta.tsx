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
      if (document.title !== title) document.title = title;
      const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
      if (meta && meta.content !== description) meta.content = description;
    }
    apply();
    // Next.js writes the (Thai) route metadata into <head> after navigation; re-apply when it does.
    const observer = new MutationObserver(apply);
    observer.observe(document.head, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ["content"] });
    return () => observer.disconnect();
  }, [title, description]);

  return null;
}
