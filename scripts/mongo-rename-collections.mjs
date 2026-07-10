// Renames the brand-namespaced collections alair_* -> whiff_* in place.
// Uses renameCollection, which is atomic and preserves documents AND indexes
// (no copy). Idempotent: skips a pair that's already been migrated.
//
//   Dry run (default, no writes):  node --env-file=.env scripts/mongo-rename-collections.mjs
//   Execute the rename:            node --env-file=.env scripts/mongo-rename-collections.mjs --commit
import { MongoClient } from "mongodb";

const RENAMES = [
  ["alair_match_games", "whiff_match_games"],
  ["alair_dating_app_stories", "whiff_dating_app_stories"],
  // Badge collections (alair_counters, alair_founder_badges) don't exist yet —
  // the badge service will create them under the new names on first write.
];

const commit = process.argv.includes("--commit");
const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || "olettrasocials";
if (!uri) throw new Error("MONGODB_URI not set");

const client = new MongoClient(uri);
try {
  await client.connect();
  const db = client.db(dbName);
  const existing = new Set((await db.listCollections().toArray()).map((c) => c.name));

  console.log(`DB: ${dbName}  —  mode: ${commit ? "COMMIT" : "DRY RUN"}\n`);

  for (const [from, to] of RENAMES) {
    const fromExists = existing.has(from);
    const toExists = existing.has(to);

    if (toExists && !fromExists) {
      console.log(`✓ ${from} -> ${to}: already migrated, skipping`);
      continue;
    }
    if (!fromExists) {
      console.log(`- ${from} -> ${to}: source missing, nothing to do`);
      continue;
    }
    if (toExists) {
      console.log(`! ${from} -> ${to}: BOTH exist — refusing to overwrite ${to}. Resolve manually.`);
      continue;
    }

    const count = await db.collection(from).estimatedDocumentCount();
    if (!commit) {
      console.log(`  would rename ${from} -> ${to}  (${count} docs, indexes preserved)`);
      continue;
    }
    await db.renameCollection(from, to);
    console.log(`✓ renamed ${from} -> ${to}  (${count} docs, indexes preserved)`);
  }

  if (!commit) console.log("\nDry run only. Re-run with --commit to apply.");
} finally {
  await client.close();
}
