import "server-only";
import { createHash, randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";
import { homeVariantOverride, isHomeVariant, type HomeVariant } from "./home-types";

type HomeRecord = { _id: string; variant: HomeVariant; updatedAt: Date };
type AttemptRecord = { _id: string; count: number; expiresAt: Date };
const shared = globalThis as typeof globalThis & {
  homeMongo?: { uri: string; client: Promise<MongoClient> };
  homeLoginAttempts?: Map<string, { count: number; expires: number }>;
};

export function localHomeStorage() {
  return process.env.NODE_ENV !== "production" && process.env.HOME_SETTINGS_STORAGE === "file";
}
export function homeStorageConfigured() {
  return localHomeStorage() || !!process.env.HOME_SETTINGS_MONGODB_URI;
}
function localPath() {
  return process.env.HOME_SETTINGS_FILE || path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "homepage.json");
}
/** Namespace persistent caching when a deployment changes databases. */
export function homeStoreCacheKey() {
  return createHash("sha256").update([
    process.env.HOME_SETTINGS_MONGODB_URI || "", process.env.HOME_SETTINGS_MONGODB_DB || "whiff_web",
    localHomeStorage() ? localPath() : "mongodb",
  ].join("\n")).digest("hex");
}
async function database() {
  const uri = process.env.HOME_SETTINGS_MONGODB_URI;
  if (!uri) throw new Error("Homepage storage is not configured");
  if (!shared.homeMongo || shared.homeMongo.uri !== uri) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS: 1200, connectTimeoutMS: 1200, socketTimeoutMS: 1500, maxPoolSize: 2 });
    const connection = client.connect().catch(error => { shared.homeMongo = undefined; void client.close(); throw error; });
    shared.homeMongo = { uri, client: connection };
  }
  return (await shared.homeMongo.client).db(process.env.HOME_SETTINGS_MONGODB_DB || "whiff_web");
}
export async function readStoredHome(): Promise<HomeVariant | null> {
  let record: { variant?: unknown } | null;
  if (localHomeStorage()) {
    try { record = JSON.parse(await readFile(/* turbopackIgnore: true */ localPath(), "utf8")); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return null; throw error; }
  } else {
    record = await (await database()).collection<HomeRecord>("website_settings").findOne({ _id: "homepage" }, { maxTimeMS: 1000 });
  }
  if (record === null) return null;
  if (!isHomeVariant(record.variant)) throw new Error("Invalid stored homepage");
  return record.variant;
}
export async function writeStoredHome(variant: HomeVariant) {
  if (!isHomeVariant(variant)) throw new Error("Invalid homepage");
  if (homeVariantOverride()) throw new Error("The deployment setting controls the homepage");
  const record: HomeRecord = { _id: "homepage", variant, updatedAt: new Date() };
  if (localHomeStorage()) {
    const file = localPath();
    await mkdir(path.dirname(file), { recursive: true, mode: 0o700 });
    const temp = `${file}.${randomUUID()}.tmp`;
    await writeFile(temp, JSON.stringify(record), { mode: 0o600 });
    await rename(temp, file);
  } else {
    await (await database()).collection<HomeRecord>("website_settings").updateOne({ _id: "homepage" },
      { $set: { variant, updatedAt: record.updatedAt } }, { upsert: true, maxTimeMS: 1000 });
  }
}
/** Production attempts persist across workers; only trust a configured proxy header. */
export async function consumeHomeLoginAttempt(key: string, now = Date.now()) {
  const expires = (Math.floor(now / 900_000) + 1) * 900_000;
  if (process.env.HOME_SETTINGS_MONGODB_URI && !localHomeStorage()) {
    const limits = (await database()).collection<AttemptRecord>("website_owner_limits");
    await limits.updateOne({ _id: key, expiresAt: { $lte: new Date(now) } }, { $set: { count: 0, expiresAt: new Date(expires) } }, { maxTimeMS: 1000 });
    const record = await limits.findOneAndUpdate({ _id: key }, {
      $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(expires) },
    }, { upsert: true, returnDocument: "after", maxTimeMS: 1000 });
    return !!record && record.count <= 10;
  }
  // Env-only mode cannot publish, and requires a >=32-character owner secret.
  // This local throttle is defence in depth, not a distributed-limit claim.
  const attempts = shared.homeLoginAttempts ??= new Map();
  for (const [id, bucket] of attempts) if (bucket.expires <= now) attempts.delete(id);
  const bucket = attempts.get(key) || { count: 0, expires };
  bucket.count += 1;
  attempts.set(key, bucket);
  return bucket.count <= 10;
}
