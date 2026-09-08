import type { Metadata } from "next";
import { RoastReview } from "./roast-review";

export const metadata: Metadata = {
  title: "Review notes",
  robots: { index: false, follow: false },
};

export default function ReviewPage() { return <RoastReview />; }
