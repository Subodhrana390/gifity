import mongoose from "mongoose";

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/gifity";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

declare global {
  var _mongooseCache: {
    conn: typeof mongoose | null;
    promise: Promise<typeof mongoose> | null;
  };
}

const globalCache = global._mongooseCache || { conn: null, promise: null };
global._mongooseCache = globalCache;

async function connectToDatabase(): Promise<typeof mongoose> {
  if (globalCache.conn) return globalCache.conn;

  if (!globalCache.promise) {
    const opts = { bufferCommands: false };
    globalCache.promise = mongoose.connect(MONGODB_URI, opts);
  }

  try {
    globalCache.conn = await globalCache.promise;
  } catch (e) {
    globalCache.promise = null;
    throw e;
  }

  return globalCache.conn;
}

export default connectToDatabase;
