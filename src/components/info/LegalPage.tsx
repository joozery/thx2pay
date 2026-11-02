"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { FileTextIcon, LockClosedIcon, EnvelopeClosedIcon } from "@radix-ui/react-icons";
import { useI18n } from "@/i18n/useI18n";
import InfoShell from "./InfoShell";
import type { LegalDoc } from "./legalContent";

// Long-form legal page: glass header, sticky table of contents, numbered sections.
export default function LegalPage({ doc }: { doc: LegalDoc }) {
  const { t } = useI18n();
  const [current, setCurrent] = useState(doc.sections[0]?.id);

  useEffect(() => {
    const observer = new IntersectionObserver(entries => {
      const visible = entries.filter(entry => entry.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
      if (visible) setCurrent(visible.target.id);
    }, { rootMargin: "-90px 0px -65% 0px" });
    doc.sections.forEach(section => { const el = document.getElementById(section.id); if (el) observer.observe(el); });
    return () => observer.disconnect();
  }, [doc]);

  const Icon = doc.kind === "privacy" ? LockClosedIcon : FileTextIcon;
  return <InfoShell crumb={doc.title}>
    <section className="info-hero legal-hero">
      <span className="info-hero-icon" aria-hidden="true"><Icon /></span>
      <span className="info-eyebrow">{doc.eyebrow}</span>
      <h1>{t(doc.title)}</h1>
      <p>{t(doc.intro)}</p>
      <span className="legal-updated">{t("ปรับปรุงล่าสุด")} {t(doc.updated)}</span>
    </section>
    <div className="legal-layout">
      <aside className="legal-toc" aria-label={t("สารบัญ")}>
        <strong>{t("สารบัญ")}</strong>
        <ol>{doc.sections.map((section, index) => <li key={section.id}><a href={`#${section.id}`} className={current === section.id ? "active" : ""} aria-current={current === section.id ? "true" : undefined}><span>{index + 1}</span>{t(section.title)}</a></li>)}</ol>
      </aside>
      <article className="legal-body">
        {doc.sections.map((section, index) => <section key={section.id} id={section.id} className="legal-section" aria-labelledby={`${section.id}-title`}>
          <h2 id={`${section.id}-title`}><span aria-hidden="true">{index + 1}</span>{t(section.title)}</h2>
          {section.body.map(paragraph => <p key={paragraph}>{t(paragraph)}</p>)}
          {section.list && <ul>{section.list.map(item => <li key={item}>{t(item)}</li>)}</ul>}
        </section>)}
        <div className="legal-contact">
          <span aria-hidden="true"><EnvelopeClosedIcon /></span>
          <div><h2>{t("มีคำถามเกี่ยวกับเอกสารนี้?")}</h2><p>{t("ติดต่อทีมงานได้ที่ support@thx2pay.com เราจะตอบกลับโดยเร็วที่สุด")}</p></div>
          <Link className="pill" href="/contact">{t("ติดต่อเรา")}</Link>
        </div>
      </article>
    </div>
  </InfoShell>;
}
