import { NextRequest } from "next/server";
import { consumeHomeLoginAttempt } from "@/app/lib/home-store";
import { correctOwnerPassword, OWNER_COOKIE, OWNER_SESSION_SECONDS, OwnerError, ownerBody,
  ownerClientKey, ownerFailure, ownerJson, ownerSameOrigin, ownerToken } from "@/app/lib/home-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await ownerBody(request);
    if (!(await consumeHomeLoginAttempt(ownerClientKey(request)))) throw new OwnerError("Too many attempts. Try again in 15 minutes.", 429);
    if (!correctOwnerPassword(body.password)) throw new OwnerError("That password is not correct.", 401);
    const response = ownerJson({ authenticated: true });
    response.cookies.set(OWNER_COOKIE, ownerToken(), { httpOnly: true, secure: process.env.NODE_ENV === "production",
      sameSite: "strict", path: "/owner", maxAge: OWNER_SESSION_SECONDS });
    return response;
  } catch (error) { return ownerFailure(error); }
}
export async function DELETE(request: NextRequest) {
  try {
    ownerSameOrigin(request);
    const response = ownerJson({ authenticated: false });
    response.cookies.set(OWNER_COOKIE, "", { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/owner", maxAge: 0 });
    return response;
  } catch (error) { return ownerFailure(error); }
}
