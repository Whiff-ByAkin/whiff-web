import { NextRequest } from "next/server";
import { body, cursor, failure, json, RequestError, requireReview } from "@/app/lib/roast-http";
import { listNotes, moderateNote } from "@/app/lib/roast-store";
import type { NoteStatus } from "@/app/lib/roast-types";

export const runtime="nodejs";
export const dynamic="force-dynamic";
export async function GET(request:NextRequest) {
  try {
    requireReview(request);
    const status=request.nextUrl.searchParams.get("status") || "pending";
    if (!["pending","approved","rejected"].includes(status)) throw new RequestError("Choose a valid review status.");
    return json(await listNotes(status as NoteStatus,cursor(request)));
  } catch(error) {return failure(error);}
}
export async function PATCH(request:NextRequest) {
  try {
    requireReview(request);
    const input=await body(request);
    if (typeof input.id!=="string" || !/^[a-f0-9-]{36}$/.test(input.id)) throw new RequestError("Choose a valid note.");
    if (input.status!=="approved" && input.status!=="rejected") throw new RequestError("Choose publish or hide.");
    if (!await moderateNote(input.id,input.status)) throw new RequestError("That note was not found.",404);
    return json({ok:true});
  } catch(error) {return failure(error);}
}
