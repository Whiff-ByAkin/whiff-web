import { randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { NOTE_COLORS, type NoteColor } from "@/app/lib/roast-types";
import { consumeLimit, insertNote, listPublicNotes } from "@/app/lib/roast-store";
import { body, clientKey, cursor, failure, json, RequestError } from "@/app/lib/roast-http";

export const runtime="nodejs";
export const dynamic="force-dynamic";

export async function GET(request:NextRequest) {
  try {
    return json(await listPublicNotes(cursor(request)));
  } catch(error) {return failure(error);}
}

export async function POST(request:NextRequest) {
  try {
    const input=await body(request);
    if (typeof input.website==="string" && input.website.trim()) throw new RequestError("This submission could not be accepted.");
    if (typeof input.message!=="string" || input.message.trim().length<3 || input.message.trim().length>400)
      throw new RequestError("Write a note between 3 and 400 characters.");
    if (input.name!==undefined && (typeof input.name!=="string" || input.name.trim().length>30)) throw new RequestError("Keep your name to 30 characters.");
    if (!NOTE_COLORS.includes(input.color as NoteColor)) throw new RequestError("Choose a note color.");
    if (input.consent!==true) throw new RequestError("Please agree to share your note publicly after review.");
    if (!await consumeLimit(`post:${clientKey(request)}`,5,60*60*1000)) throw new RequestError("A few notes go a long way. Please try again in an hour.",429);
    await insertNote({id:randomUUID(),message:input.message.trim(),name:typeof input.name==="string" ? input.name.trim() || "Anonymous" : "Anonymous",color:input.color as NoteColor,status:"pending",createdAt:new Date().toISOString(),publishedAt:null});
    return json({status:"pending"},201);
  } catch(error) {return failure(error);}
}
