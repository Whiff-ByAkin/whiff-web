import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

export class RequestError extends Error {
  constructor(message:string, public status=400) { super(message); }
}
export function json(value:unknown,status=200) {
  return NextResponse.json(value,{status,headers:{"Cache-Control":"no-store","X-Content-Type-Options":"nosniff","X-Robots-Tag":"noindex"}});
}
export function failure(error:unknown) {
  if (error instanceof RequestError) return json({error:error.message},error.status);
  // Never leak Mongo connection details or submitted content in logs/responses.
  console.error("Roast request unavailable:",error instanceof Error ? error.name : "unknown");
  return json({error:"The wall is temporarily unavailable. Please try again shortly."},503);
}
export function sameOrigin(request:NextRequest) {
  const origin=request.headers.get("origin");
  const target=new URL(request.url);
  // Next may normalize the internal URL to localhost while the browser uses
  // 127.0.0.1. Host retains the actual requested host, without trusting an
  // arbitrary forwarded-host header. The browser cannot forge Host.
  const host=request.headers.get("host") || target.host;
  let matches=true;
  if (origin) {
    try {const source=new URL(origin); matches=source.host===host && source.protocol===target.protocol;}
    catch {matches=false;}
  }
  if (request.headers.get("sec-fetch-site")==="cross-site" || !matches) throw new RequestError("Please submit from this website.",403);
}
export async function body(request:NextRequest):Promise<Record<string,unknown>> {
  sameOrigin(request);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new RequestError("Please send JSON.",415);
  if (Number(request.headers.get("content-length"))>8192) throw new RequestError("Your note is too long.",413);
  const reader=request.body?.getReader();
  if (!reader) throw new RequestError("Missing request.");
  const parts:Uint8Array[]=[];
  let size=0;
  try {
    while (true) {
      const {done,value}=await reader.read(); if (done) break;
      size+=value.byteLength;
      if (size>8192) { await reader.cancel(); throw new RequestError("Your note is too long.",413); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    const parsed=JSON.parse(Buffer.concat(parts).toString("utf8"));
    if (!parsed || typeof parsed!=="object" || Array.isArray(parsed)) throw new Error();
    return parsed;
  } catch { throw new RequestError("That request could not be read."); }
}
function secret() {
  const password=process.env.ROAST_ADMIN_PASSWORD;
  if (!password || password.length<24) throw new RequestError("The review area has not been configured.",503);
  return password;
}
function equal(a:string,b:string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(),createHash("sha256").update(b).digest());
}
export function correctPassword(input:string) { return equal(input,secret()); }
function sign(value:string) {return createHmac("sha256",secret()).update(value).digest("base64url");}
export function sessionToken() {const expires=String(Date.now()+8*60*60*1000); return `${expires}.${sign(expires)}`;}
export const SESSION_COOKIE="whiff_roast_review";
export function requireReview(request:NextRequest) {
  const token=request.cookies.get(SESSION_COOKIE)?.value || "";
  const [expires,signature,...extra]=token.split(".");
  if (extra.length || !/^\d{13}$/.test(expires || "") || !signature || Number(expires)<=Date.now() || !equal(signature,sign(expires)))
    throw new RequestError("Please sign in to review notes.",401);
}
export function clientKey(request:NextRequest) {
  // Trust a forwarding header only when explicitly configured for the host's
  // trusted proxy. Otherwise one shared bucket is safer than a spoofable IP.
  const header=process.env.ROAST_IP_HEADER;
  const address=header ? request.headers.get(header)?.split(",")[0].trim() || "unknown" : "shared";
  return createHmac("sha256",secret()).update(address).digest("hex");
}
export function cursor(request:NextRequest) {
  const raw=request.nextUrl.searchParams.get("cursor");
  if (!raw) return undefined;
  try {
    if (raw.length>300) throw new Error();
    const c=JSON.parse(Buffer.from(raw,"base64url").toString());
    if (typeof c.createdAt!=="string" || new Date(c.createdAt).toISOString()!==c.createdAt || typeof c.id!=="string" || !/^[a-f0-9-]{36}$/.test(c.id)) throw new Error();
    return {createdAt:c.createdAt as string,id:c.id as string};
  } catch {throw new RequestError("That page link has expired. Refresh the wall.");}
}
