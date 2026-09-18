import { HomeScreen } from "./home-screen";
import { CityHomeScreen } from "./city-home-screen";
import { JsonLd } from "./json-ld";
import { organization, service, ORG_ID, WEBSITE_ID, abs } from "../lib/structured-data";
import type { HomeVariant } from "../lib/home-types";

const cityDescription = "Whiff helps newcomers and longtime locals make platonic friends in Minneapolis and Saint Paul. The same four people meet for six planned activities over twelve weeks. First circles are forming; App Store and Google Play links are coming soon.";

export function HomeVariantView({ variant }: { variant: HomeVariant }) {
  return <div data-home-variant={variant}>{variant === "classic" ? <HomeScreen /> : <>
    <JsonLd nodes={[
      organization,
      { "@type": "WebPage", "@id": `${abs("/mn")}#webpage`, url: abs("/mn"), name: "Make friends in Minneapolis and Saint Paul", description: cityDescription, isPartOf: { "@id": WEBSITE_ID }, publisher: { "@id": ORG_ID }, mainEntity: { "@id": `${abs("/mn")}#service` } },
      { ...service, "@id": `${abs("/mn")}#service`, url: abs("/mn"), description: cityDescription, audience: { "@type": "Audience", audienceType: "Adults 21 and older who recently moved to Minneapolis and Saint Paul and locals who want to share city activities with new arrivals" } },
    ]} />
    <CityHomeScreen />
  </>}</div>;
}
