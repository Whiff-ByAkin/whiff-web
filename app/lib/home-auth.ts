import "server-only";
import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { cookies, headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export const OWNER_COOKIE = "whiff_site_owner";
export const OWNER_SESSION_SECONDS = 8 * 60 * 60;
export class OwnerError extends Error {
  constructor(message: string, public status = 400) { super(message); }
}
function secret() {
  const value = process.env.HOME_ADMIN_PASSWORD;
  if (!value || value.length < 32) throw new OwnerError("The owner password has not been configured.", 503);
  return value;
}
function equal(a: string, b: string) {
  return timingSafeEqual(createHash("sha256").update(a).digest(), createHash("sha256").update(b).digest());
}
function signature(value: string) {
  return createHmac("sha256", secret()).update(`whiff-owner:${value}`).digest("base64url");
}
export function correctOwnerPassword(value: unknown) {
  return typeof value === "string" && equal(value, secret());
}
export function ownerToken(now = Date.now()) {
  const expires = String(now + OWNER_SESSION_SECONDS * 1000);
  return `${expires}.${signature(expires)}`;
}
export function validOwnerToken(token: string | undefined, now = Date.now()) {
  if (!token || token.length > 100) return false;
  const [expires, signed, ...extra] = token.split(".");
  if (extra.length || !/^\d{13}$/.test(expires) || !signed || Number(expires) <= now || Number(expires) > now + OWNER_SESSION_SECONDS * 1000) return false;
  try { return equal(signed, signature(expires)); } catch { return false; }
}
/** Explicit loopback preview convenience; impossible in a production build. */
export function localOwnerAccess(host: string | null) {
  return process.env.NODE_ENV === "development" && process.env.HOME_LOCAL_OWNER === "1" &&
    !!host && /^(localhost|127\.0\.0\.1|\[::1\])(:\d+)?$/.test(host);
}
export async function isOwner() {
  if (localOwnerAccess((await headers()).get("host"))) return true;
  return validOwnerToken((await cookies()).get(OWNER_COOKIE)?.value);
}
export function requireOwner(request: NextRequest) {
  if (!localOwnerAccess(request.headers.get("host")) && !validOwnerToken(request.cookies.get(OWNER_COOKIE)?.value)) {
    throw new OwnerError("Please sign in to manage the homepage.", 401);
  }
}
export function ownerSameOrigin(request: NextRequest) {
  const target = new URL(request.url);
  try {
    const source = new URL(request.headers.get("origin") || "");
    if (source.host !== (request.headers.get("host") || target.host) || source.protocol !== target.protocol || request.headers.get("sec-fetch-site") === "cross-site") throw new Error();
  } catch { throw new OwnerError("Please use the owner page on this website.", 403); }
}
export async function ownerBody(request: NextRequest): Promise<Record<string, unknown>> {
  ownerSameOrigin(request);
  if (!request.headers.get("content-type")?.toLowerCase().startsWith("application/json")) throw new OwnerError("Please send JSON.", 415);
  if (Number(request.headers.get("content-length")) > 1024) throw new OwnerError("Request too large.", 413);
  const reader = request.body?.getReader();
  if (!reader) throw new OwnerError("Missing request.");
  const parts: Uint8Array[] = [];
  let length = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      length += value.byteLength;
      if (length > 1024) { await reader.cancel(); throw new OwnerError("Request too large.", 413); }
      parts.push(value);
    }
  } finally { reader.releaseLock(); }
  try {
    const value = JSON.parse(Buffer.concat(parts).toString("utf8"));
    if (!value || typeof value !== "object" || Array.isArray(value)) throw new Error();
    return value;
  } catch { throw new OwnerError("That request could not be read."); }
}
export function ownerClientKey(request: NextRequest) {
  const header = process.env.HOME_ADMIN_IP_HEADER;
  const address = header ? request.headers.get(header)?.split(",")[0].trim() || "shared" : "shared";
  return createHash("sha256").update(address).digest("hex");
}
export function ownerJson(value: unknown, status = 200) {
  return NextResponse.json(value, { status, headers: {
    "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "X-Content-Type-Options": "nosniff",
  } });
}
export function ownerFailure(error: unknown) {
  return error instanceof OwnerError ? ownerJson({ error: error.message }, error.status)
    : ownerJson({ error: "Homepage settings are temporarily unavailable. Refresh to check the saved version before retrying." }, 503);
}
