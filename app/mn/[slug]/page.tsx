import { notFound } from "next/navigation";
import { findGuide, MINNESOTA_GUIDES } from "../../guides/content";
import { GuidePage, guideMetadata } from "../../guides/guide-page";
type Props = { params: Promise<{ slug: string }> };
export const dynamicParams = false;
export function generateStaticParams() { return MINNESOTA_GUIDES.map(({ slug }) => ({ slug })); }
export async function generateMetadata({ params }: Props) { const guide = findGuide("mn", (await params).slug); if (!guide) notFound(); return guideMetadata(guide); }
export default async function Page({ params }: Props) { const guide = findGuide("mn", (await params).slug); if (!guide) notFound(); return <GuidePage guide={guide} />; }
