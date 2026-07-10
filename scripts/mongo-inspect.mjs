// READ-ONLY inspection of the live Mongo DB: lists collections and doc counts
// so we can plan the alair_ -> whiff_ rename safely. Makes no writes.
// Run: node --env-file=.env scripts/mongo-inspect.mjs
import { MongoClient } from "mongodb";

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "olettrasocials";
if (!uri) throw new Error("MONGODB_URI not set");

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const cols = await db.listCollections().toArray();
  const names = cols.map((c) => c.name).sort();

  const rows = [];
  for (const name of names) {
    if (!/^(alair_|whiff_)/.test(name)) continue;
    const count = await db.collection(name).estimatedDocumentCount();
    const idx = await db.collection(name).indexes();
    rows.push({ name, count, indexes: idx.map((i) => i.name).join(", ") });
  }

  console.log(`DB: ${dbName}`);
  console.log(`All collections (${names.length}):`, names.join(", "));
  console.log("\nBrand-namespaced collections:");
  if (rows.length === 0) console.log("  (none found)");
  for (const r of rows) {
    console.log(`  ${r.name}  —  ${r.count} docs  —  indexes: [${r.indexes}]`);
  }
} finally {
  await client.close();
}
