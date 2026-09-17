import { HomeVariantView } from "./components/home-variant-view";
import { homeMetadata } from "./lib/home-metadata";

export const metadata = homeMetadata("classic");

export default function Home() {
  return <HomeVariantView variant="classic" />;
}
