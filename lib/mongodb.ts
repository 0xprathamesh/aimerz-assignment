import mongoose, { Mongoose } from "mongoose";

const MONGODB_URI = "mongodb+srv://0x:0x@todo.eqs4szd.mongodb.net/?retryWrites=true&w=majority&appName=Todo";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URL environment variable inside .env"
  );
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
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose.connect(MONGODB_URI!, opts).then((mongoose) => {
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
