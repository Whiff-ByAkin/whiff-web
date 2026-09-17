import { HomeOwnerControls } from "@/app/components/home-owner-controls";
import { headers } from "next/headers";
import { isOwner, localOwnerAccess } from "@/app/lib/home-auth";
export default async function OwnerPage() {
  const authenticated = await isOwner();
  return <HomeOwnerControls authenticated={authenticated} localPreview={localOwnerAccess((await headers()).get("host"))}  />;
}
