import { MongoClient, type Db } from "mongodb";

declare global {
  var whiffMongoClientPromise: Promise<MongoClient> | undefined;
}

function getMongoUri() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is not configured.");
  }

  return uri;
}

export async function getMongoDb(): Promise<Db> {
  const dbName = process.env.MONGODB_DB || "olettrasocials";

  if (!global.whiffMongoClientPromise) {
    const client = new MongoClient(getMongoUri());
    global.whiffMongoClientPromise = client.connect();
  }

  const client = await global.whiffMongoClientPromise;

  return client.db(dbName);
}
