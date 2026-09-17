import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { HomeVariantView } from "@/app/components/home-variant-view";
import { isOwner } from "@/app/lib/home-auth";
import { isHomeVariant } from "@/app/lib/home-types";
import { homeMetadata } from "@/app/lib/home-metadata";
type Props = { params: Promise<{ variant: string }> };
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { variant } = await params;
  if (!isHomeVariant(variant)) return {};
  return { ...homeMetadata(variant), robots: { index: false, follow: false, googleBot: { index: false, follow: false } } };
}
export default async function HomePreview({ params }: Props) {
  if (!(await isOwner())) redirect("/owner");
  const { variant } = await params;
  if (!isHomeVariant(variant)) notFound();
  return <div data-home-preview="true"><HomeVariantView variant={variant} /></div>;
}
