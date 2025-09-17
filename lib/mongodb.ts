import mongoose from "mongoose";

let cached = (global as any).mongoose;
if (!cached) cached = (global as any).mongoose = { conn: null, promise: null };

export async function dbConnect() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGODB_URI!, {
      dbName: process.env.MONGODB_DB,
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}
