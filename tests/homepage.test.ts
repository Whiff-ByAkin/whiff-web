import assert from "node:assert/strict";
import { after, before, beforeEach, test } from "node:test";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { randomBytes, randomUUID } from "node:crypto";
import { NextRequest } from "next/server";
import { homeVariantOverride, isHomeVariant } from "../app/lib/home-types";
import { consumeHomeLoginAttempt, homeStorageConfigured, localHomeStorage, readStoredHome, writeStoredHome } from "../app/lib/home-store";
import { correctOwnerPassword, localOwnerAccess, OWNER_COOKIE, OWNER_SESSION_SECONDS, ownerBody, ownerSameOrigin, ownerToken, requireOwner, validOwnerToken } from "../app/lib/home-auth";
import { POST as login, DELETE as logout } from "../app/owner/api/session/route";

let directory: string;
const password = randomBytes(32).toString("base64url");
before(async () => { directory = await mkdtemp(path.join(tmpdir(), "whiff-home-test-")); });
beforeEach(() => {
  Object.assign(process.env, { NODE_ENV: "test", HOME_ADMIN_PASSWORD: password, HOME_SETTINGS_STORAGE: "file", HOME_SETTINGS_FILE: path.join(directory, `${randomUUID()}.json`) });
  delete process.env.HOME_VARIANT;
  delete process.env.HOME_SETTINGS_MONGODB_URI;
  delete process.env.HOME_LOCAL_OWNER;
  delete process.env.HOME_ADMIN_IP_HEADER;
});
after(async () => { await rm(directory, { recursive: true, force: true }); });

function request(method = "GET", data?: unknown, token?: string, origin = "http://localhost:3100") {
  return new NextRequest("http://localhost:3100/owner/api/session", {
    method, headers: { origin, ...(data !== undefined ? { "content-type": "application/json" } : {}), ...(token ? { cookie: `${OWNER_COOKIE}=${token}` } : {}) },
    ...(data !== undefined ? { body: JSON.stringify(data) } : {}),
  });
}

test("only explicit known variants can override the original default", () => {
  assert.equal(homeVariantOverride(), undefined);
  for (const invalid of ["City", "", "false", "../city", "classic city"]) assert.equal(homeVariantOverride(invalid), undefined);
  assert.equal(homeVariantOverride("city"), "city");
  assert.equal(homeVariantOverride("classic"), "classic");
  assert.equal(isHomeVariant({ variant: "city" }), false);
});

test("local switch persists city and rollback; bad data is not treated as a selection", async () => {
  assert.equal(await readStoredHome(), null);
  await writeStoredHome("city");
  assert.equal(await readStoredHome(), "city");
  await writeStoredHome("classic");
  assert.equal(await readStoredHome(), "classic");
  const saved = JSON.parse(await readFile(process.env.HOME_SETTINGS_FILE!, "utf8"));
  assert.equal(saved._id, "homepage");
  assert.ok(saved.updatedAt);
  await writeFile(process.env.HOME_SETTINGS_FILE!, JSON.stringify({ variant: "surprise" }));
  await assert.rejects(readStoredHome());
});

test("deployment override locks writes and production never uses local settings", async () => {
  process.env.HOME_VARIANT = "classic";
  await assert.rejects(writeStoredHome("city"));
  delete process.env.HOME_VARIANT;
  Object.assign(process.env, { NODE_ENV: "production" });
  assert.equal(localHomeStorage(), false);
  assert.equal(homeStorageConfigured(), false);
  await assert.rejects(writeStoredHome("city"));
});

test("owner sessions reject expiry, tampering, surplus fields, and password rotation", () => {
  const now = Date.now();
  const token = ownerToken(now);
  assert.equal(validOwnerToken(token, now), true);
  assert.equal(validOwnerToken(token, now + OWNER_SESSION_SECONDS * 1000), false);
  assert.equal(validOwnerToken(`${token}.extra`, now), false);
  assert.equal(validOwnerToken(token.replace(/.$/, "!"), now), false);
  assert.equal(validOwnerToken(undefined), false);
  process.env.HOME_ADMIN_PASSWORD = randomBytes(32).toString("base64url");
  assert.equal(validOwnerToken(token, now), false);
});

test("short or missing owner secrets never authenticate", () => {
  assert.equal(correctOwnerPassword(password), true);
  assert.equal(correctOwnerPassword("wrong"), false);
  process.env.HOME_ADMIN_PASSWORD = "short";
  assert.throws(() => correctOwnerPassword("short"));
  assert.equal(validOwnerToken(`${Date.now() + 1000}.fake`), false);
});

test("owner authorization fails closed; local bypass requires development plus loopback", () => {
  assert.throws(() => requireOwner(request()));
  requireOwner(request("GET", undefined, ownerToken()));
  process.env.HOME_LOCAL_OWNER = "1";
  assert.equal(localOwnerAccess("localhost:3100"), false);
  Object.assign(process.env, { NODE_ENV: "development" });
  assert.equal(localOwnerAccess("localhost:3100"), true);
  assert.equal(localOwnerAccess("127.0.0.1:3100"), true);
  assert.equal(localOwnerAccess("localhost.evil.test:3100"), false);
  Object.assign(process.env, { NODE_ENV: "production" });
  assert.equal(localOwnerAccess("localhost:3100"), false);
});

test("mutations require a matching browser origin and bounded object JSON", async () => {
  ownerSameOrigin(request("POST", {}));
  assert.throws(() => ownerSameOrigin(request("POST", {}, undefined, "https://evil.example")));
  const missing = request("POST", {}); missing.headers.delete("origin");
  assert.throws(() => ownerSameOrigin(missing));
  const crossSite = request("POST", {}); crossSite.headers.set("sec-fetch-site", "cross-site");
  assert.throws(() => ownerSameOrigin(crossSite));
  await assert.rejects(ownerBody(request("POST", ["city"])));
  await assert.rejects(ownerBody(request("POST", { password: "a".repeat(1100) })));
  assert.deepEqual(await ownerBody(request("POST", { variant: "city" })), { variant: "city" });
});

test("login cookies are private, scoped, secure in production, and logout expires them", async () => {
  Object.assign(process.env, { NODE_ENV: "production" });
  const response = await login(request("POST", { password }));
  assert.equal(response.status, 200);
  const cookie = response.headers.get("set-cookie")!;
  assert.match(cookie, /HttpOnly/i); assert.match(cookie, /Secure/i);
  assert.match(cookie, /Path=\/owner/i); assert.match(cookie, /SameSite=strict/i);
  assert.equal(response.headers.get("cache-control"), "private, no-store");
  assert.equal((await logout(request("DELETE"))).cookies.get(OWNER_COOKIE)?.value, "");
  assert.equal((await login(request("POST", { password: "wrong" }))).status, 401);
});

test("login attempt windows cap requests and reset after expiry", async () => {
  const key = randomUUID(); const now = Date.now();
  for (let i = 0; i < 10; i++) assert.equal(await consumeHomeLoginAttempt(key, now), true);
  assert.equal(await consumeHomeLoginAttempt(key, now), false);
  assert.equal(await consumeHomeLoginAttempt(key, now + 900_000), true);
});
