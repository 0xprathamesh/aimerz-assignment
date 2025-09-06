import mongoose, { Mongoose } from "mongoose";
import { getBuildEnv } from "./build-env";

const MONGODB_URI = getBuildEnv().MONGODB_URI;

if (!MONGODB_URI) {
  console.warn("MONGODB_URI not defined, database connection will be skipped");
}

declare global {
  var mongoose:
    | {
        conn: Mongoose | null;
        promise: Promise<Mongoose> | null;
      }
    | undefined;
}

const cached: {
  conn: Mongoose | null;
  promise: Promise<Mongoose> | null;
} = global.mongoose ?? { conn: null, promise: null };

if (!global.mongoose) {
  global.mongoose = cached;
}

async function connectDB(): Promise<Mongoose> {
  if (!MONGODB_URI) {
    console.warn(
      "MONGODB_URI not defined, database connection will be skipped"
    );
    return {} as Mongoose;
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default connectDB;
