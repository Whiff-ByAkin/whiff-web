import { NextRequest } from "next/server";
import { body, clientKey, correctPassword, failure, json, RequestError, sameOrigin, SESSION_COOKIE, sessionToken } from "@/app/lib/roast-http";
import { consumeLimit } from "@/app/lib/roast-store";

export const runtime="nodejs";
export async function POST(request:NextRequest) {
  try {
    const input=await body(request);
    if (!await consumeLimit(`login:${clientKey(request)}`,10,15*60*1000)) throw new RequestError("Too many attempts. Try again in 15 minutes.",429);
    if (typeof input.password!=="string" || !correctPassword(input.password)) throw new RequestError("That password didn’t match.",401);
    const response=json({ok:true});
    response.cookies.set(SESSION_COOKIE,sessionToken(),{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/api/roasts",maxAge:8*60*60});
    return response;
  } catch(error) {return failure(error);}
}
export async function DELETE(request:NextRequest) {
  try {
    sameOrigin(request);
    const response=json({ok:true});
    response.cookies.set(SESSION_COOKIE,"",{httpOnly:true,secure:process.env.NODE_ENV==="production",sameSite:"strict",path:"/api/roasts",maxAge:0});
    return response;
  } catch(error) {return failure(error);}
}
