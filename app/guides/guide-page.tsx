import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "../components/header";
import { JsonLd } from "../components/json-ld";
import { DownloadButtons } from "../components/download-buttons";
import { SITE_NAME } from "../config/site";
import { abs, organization, website, ORG_ID } from "../lib/structured-data";
import { GUIDES, GUIDE_UPDATED, guidePath, type Guide } from "./content";
import styles from "./guide.module.css";

export function guideMetadata(guide: Guide): Metadata {
  const url = guidePath(guide);
  return {
    title: guide.shortTitle === "The time friendship takes" ? "How long does it take to make friends? Hall’s research" : guide.title,
    description: guide.description,
    alternates: { canonical: url },
    openGraph: { type: "article", title: guide.title, description: guide.description, url, siteName: SITE_NAME, publishedTime: GUIDE_UPDATED, modifiedTime: GUIDE_UPDATED, authors: ["Whiff team"], images: [{ url: abs("/opengraph-image"), width: 1200, height: 630, alt: "Whiff — strangers only on week one" }] },
    twitter: { card: "summary_large_image", title: guide.title, description: guide.description, images: [abs("/opengraph-image")] },
  };
}
export function GuidePage({ guide }: { guide: Guide }) {
  const path = guidePath(guide);
  const parent = guide.collection === "mn" ? { href: "/mn", name: "Minnesota" } : { href: "/blog", name: "Field notes" };
  const citations = [...new Set(guide.sections.flatMap((section) => section.sources?.map((source) => source.href) ?? []))];
  return <>
    <JsonLd nodes={[organization, website, {
      "@type": "Article", "@id": `${abs(path)}#article`, url: abs(path), headline: guide.title, description: guide.description,
      datePublished: GUIDE_UPDATED, dateModified: GUIDE_UPDATED, inLanguage: "en-US", image: abs("/opengraph-image"),
      author: { "@type": "Organization", name: "Whiff team", url: abs("/") }, publisher: { "@id": ORG_ID },
      mainEntityOfPage: { "@type": "WebPage", "@id": abs(path) }, citation: citations,
      articleBody: [guide.intro, guide.takeaway, ...guide.sections.flatMap((section) => [section.title, ...section.paragraphs])].join("\n\n"),
    }, { "@type": "BreadcrumbList", itemListElement: [{ "@type": "ListItem", position: 1, name: "Home", item: abs("/") }, { "@type": "ListItem", position: 2, name: parent.name, item: abs(parent.href) }, { "@type": "ListItem", position: 3, name: guide.shortTitle, item: abs(path) }] }]} />
    <Header />
    <main id="main" className={styles.page}>
      <nav aria-label="Breadcrumb" className={styles.breadcrumb}><Link href="/">Whiff</Link><span aria-hidden="true">/</span><Link href={parent.href}>{parent.name}</Link><span aria-hidden="true">/</span><span>{guide.shortTitle}</span></nav>
      <header className={styles.hero}><p className={styles.eyebrow}>{guide.label}</p><h1>{guide.title}</h1><p className={styles.intro}>{guide.intro}</p><p className={styles.byline}>By Whiff team · Updated <time dateTime={GUIDE_UPDATED}>September 18, 2026</time></p></header>
      <div className={styles.body}>
        <nav aria-label="In this guide" className={styles.toc}><p>IN THIS GUIDE</p><ol>{guide.sections.map((section) => <li key={section.id}><a href={`#${section.id}`}>{section.title}</a></li>)}</ol></nav>
        <article className={styles.article} aria-label={guide.title}>
          <aside className={styles.takeaway}><p>{guide.takeaway}</p></aside>
          {guide.sections.map((section) => <section key={section.id} id={section.id} aria-labelledby={`${section.id}-title`}><h2 id={`${section.id}-title`}>{section.title}</h2>{section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}{section.sources && <div className={styles.sources}>{section.sources.map((source) => <a key={source.href} href={source.href}>{source.label} <span aria-hidden="true">↗</span></a>)}</div>}</section>)}
          <section className={styles.download} aria-labelledby="download-guide-title"><p className={styles.eyebrow}>FOUR PEOPLE. A REASON TO RETURN.</p><h2 id="download-guide-title">Meet Whiff.</h2><p>Platonic friendship through shared activities. First circles forming in Minneapolis–Saint Paul. App-store links are coming soon.</p><DownloadButtons /><p><Link href="/#first-outing">See an example outing →</Link></p></section>
          <nav className={styles.related} aria-label="Keep exploring"><h2>Keep exploring.</h2><ul>{GUIDES.filter((item) => guidePath(item) !== path).map((item) => <li key={item.slug}><Link href={guidePath(item)}>{item.shortTitle}</Link></li>)}</ul></nav>
        </article>
      </div>
    </main>
  </>;
}
