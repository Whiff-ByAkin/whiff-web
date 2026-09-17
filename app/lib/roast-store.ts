import "server-only";
import { randomUUID } from "node:crypto";
import { mkdir, open, readFile, rename, unlink } from "node:fs/promises";
import path from "node:path";
import { MongoClient } from "mongodb";
import type { RoastNote, NoteStatus } from "./roast-types";

type Bucket = { _id: string; count: number; expiresAt: Date };
type LocalState = { notes: RoastNote[]; limits: Record<string, { count: number; expiresAt: string }> };
const globals = globalThis as typeof globalThis & { roastMongo?: Promise<MongoClient>; roastIndexes?: Promise<void> };

function isLocalStore() {
  // Local files are useful for a working preview, but are not durable on
  // serverless hosts. Production always uses shared MongoDB and fails closed.
  return process.env.NODE_ENV !== "production" && process.env.ROAST_STORAGE === "file";
}

async function database() {
  const uri=process.env.ROAST_MONGODB_URI || process.env.MONGODB_URI;
  if (!uri) throw new Error("Roast database is not configured");
  if (!globals.roastMongo) {
    const client = new MongoClient(uri, { serverSelectionTimeoutMS:5000, maxPoolSize:5 });
    globals.roastMongo = client.connect().catch(error => { globals.roastMongo = undefined; throw error; });
  }
  const db = (await globals.roastMongo).db(process.env.ROAST_MONGODB_DB || process.env.MONGODB_DB || "whiff_web");
  if (!globals.roastIndexes) {
    globals.roastIndexes = Promise.all([
      db.collection("website_roasts").createIndex({ id:1 }, { unique:true }),
      db.collection("website_roasts").createIndex({ status:1, createdAt:-1, id:-1 }),
      db.collection("website_roast_limits").createIndex({ expiresAt:1 }, { expireAfterSeconds:0 }),
    ]).then(() => undefined).catch(error => { globals.roastIndexes=undefined; throw error; });
  }
  await globals.roastIndexes;
  return db;
}

async function localState<T>(work: (state:LocalState) => T, write = false):Promise<T> {
  // Keep preview-only filesystem paths out of the production dependency trace.
  if (process.env.NODE_ENV === "production") throw new Error("Local preview storage is disabled in production");
  const file = process.env.ROAST_DATA_FILE || path.join(/* turbopackIgnore: true */ process.cwd(), ".data", "roasts.json");
  await mkdir(path.dirname(file), { recursive:true, mode:0o700 });
  const lockPath = `${file}.lock`;
  let lock;
  for (let i=0; i<100; i++) {
    try { lock = await open(lockPath, "wx", 0o600); break; }
    catch (error) {
      if ((error as NodeJS.ErrnoException).code !== "EEXIST") throw error;
      await new Promise(resolve => setTimeout(resolve, 30));
    }
  }
  if (!lock) throw new Error("Roast store is busy");
  const temp = `${file}.${randomUUID()}.tmp`;
  try {
    let state:LocalState = { notes:[], limits:{} };
    try { state = JSON.parse(await readFile(/* turbopackIgnore: true */ file, "utf8")); }
    catch (error) { if ((error as NodeJS.ErrnoException).code !== "ENOENT") throw error; }
    const result = work(state);
    if (write) {
      const output = await open(temp, "wx", 0o600);
      try { await output.writeFile(JSON.stringify(state)); await output.sync(); }
      finally { await output.close(); }
      await rename(temp, file);
    }
    return result;
  } finally {
    await unlink(temp).catch(() => {});
    await lock.close();
    await unlink(lockPath);
  }
}

export async function consumeLimit(key:string, max:number, windowMs:number) {
  const now = Date.now();
  const bucketKey = `${key}:${Math.floor(now/windowMs)}`;
  const expiresAt = new Date((Math.floor(now/windowMs)+1)*windowMs);
  if (isLocalStore()) return localState(state => {
    for (const [id, value] of Object.entries(state.limits)) if (Date.parse(value.expiresAt)<=now) delete state.limits[id];
    const bucket = state.limits[bucketKey] || { count:0, expiresAt:expiresAt.toISOString() };
    bucket.count++;
    state.limits[bucketKey]=bucket;
    return bucket.count<=max;
  }, true);
  const db=await database();
  const bucket=await db.collection<Bucket>("website_roast_limits").findOneAndUpdate(
    { _id:bucketKey }, { $inc:{ count:1 }, $setOnInsert:{ expiresAt } }, { upsert:true, returnDocument:"after" },
  );
  return !!bucket && bucket.count<=max;
}

export async function insertNote(note:RoastNote) {
  if (isLocalStore()) return localState(state => {
    if (state.notes.length>=10000) throw new Error("Local preview capacity reached");
    state.notes.push(note);
  }, true);
  await (await database()).collection<RoastNote>("website_roasts").insertOne(note);
}

export async function listNotes(status:NoteStatus, before?:{createdAt:string;id:string}) {
  const limit=24;
  let notes:RoastNote[];
  if (isLocalStore()) notes=await localState(state => state.notes
    .filter(note=>note.status===status && (!before || note.createdAt<before.createdAt || (note.createdAt===before.createdAt && note.id<before.id)))
    .sort((a,b)=>b.createdAt.localeCompare(a.createdAt)||b.id.localeCompare(a.id)).slice(0,limit+1));
  else notes=await (await database()).collection<RoastNote>("website_roasts").find({
    status,
    ...(before ? { $or:[{createdAt:{$lt:before.createdAt}},{createdAt:before.createdAt,id:{$lt:before.id}}] } : {}),
  }, { projection:{_id:0} }).sort({createdAt:-1,id:-1}).limit(limit+1).toArray();
  const more=notes.length>limit;
  notes=notes.slice(0,limit);
  const last=notes.at(-1);
  return { notes, nextCursor:more && last ? Buffer.from(JSON.stringify({createdAt:last.createdAt,id:last.id})).toString("base64url") : null };
}

export async function moderateNote(id:string,status:"approved"|"rejected") {
  const publishedAt=status==="approved"?new Date().toISOString():null;
  if (isLocalStore()) return localState(state => {
    const note=state.notes.find(note=>note.id===id);
    if (!note) return false;
    note.status=status; note.publishedAt=publishedAt;
    return true;
  }, true);
  const result=await (await database()).collection<RoastNote>("website_roasts").updateOne({id},{$set:{status,publishedAt}});
  return result.matchedCount===1;
}

/** A shared public projection for server-rendered HTML and the public API. */
export async function listPublicNotes(before?: { createdAt: string; id: string }) {
  const result = await listNotes("approved", before);
  return {
    nextCursor: result.nextCursor,
    notes: result.notes.map(({ id, message, name, color, createdAt, publishedAt }) =>
      ({ id, message, name, color, createdAt, publishedAt })),
  };
}

/** Lookup filters on approval in storage, never fetches private text for public callers. */
export async function getPublicNote(id: string) {
  const note = isLocalStore()
    ? await localState(state => state.notes.find(note => note.id === id && note.status === "approved"))
    : await (await database()).collection<RoastNote>("website_roasts").findOne(
      { id, status: "approved" },
      { projection: { _id: 0, id: 1, message: 1, name: 1, color: 1, createdAt: 1, publishedAt: 1 } },
    );
  if (!note) return null;
  const { message, name, color, createdAt, publishedAt } = note;
  return { id, message, name, color, createdAt, publishedAt };
}
