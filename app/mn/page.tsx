import { HomeVariantView } from "../components/home-variant-view";
import { homeMetadata } from "../lib/home-metadata";
export const metadata = homeMetadata("city");
export default function MinnesotaPage() {
  return <HomeVariantView variant="city" />;
}
