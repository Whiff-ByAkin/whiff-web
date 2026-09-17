import { NextRequest } from "next/server";
import { ownerFailure, ownerJson, requireOwner } from "@/app/lib/home-auth";
export async function PUT(request: NextRequest) {
  try {
    requireOwner(request);
    return ownerJson({ error: "The pages now have fixed addresses. The original homepage is at / and Minnesota is at /mn." }, 410);
  } catch (error) { return ownerFailure(error); }
}
export async function GET(request: NextRequest) {
  try { requireOwner(request); return ownerJson({ variant: "classic", source: "default", editable: false, cityPath: "/mn" }); }
  catch (error) { return ownerFailure(error); }
}
