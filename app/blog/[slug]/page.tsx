import { notFound } from "next/navigation";
import { findGuide, GUIDES } from "../../guides/content";
import { GuidePage, guideMetadata } from "../../guides/guide-page";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return GUIDES.filter((guide) => guide.collection === "blog").map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const guide = findGuide("blog", (await params).slug); if (!guide) notFound(); return guideMetadata(guide); }
export default async function Page({ params }: Props) { const guide = findGuide("blog", (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} />; }
