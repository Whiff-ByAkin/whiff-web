import type { Metadata } from "next";
export const metadata: Metadata = {
  title: { absolute: "Whiff · Private homepage studio" },
  description: "Private homepage previews and publishing controls.",
  robots: { index: false, follow: false, googleBot: { index: false, follow: false } },
};
export default function OwnerLayout({ children }: { children: React.ReactNode }) { return children; }
