import mongoose from "mongoose";

// Why this file exists:
// In Next.js App Router, the code runs in serverless environments. This means route handlers
// are executed on-demand and can shut down dynamically.
// Express applications maintain a persistent, long-running TCP connection.
// Serverless functions, however, boot up and shut down on each request. If we call 
// `mongoose.connect()` on every request, we will quickly run out of database connections.
// Therefore, we must implement connection caching.

const MONGODB_URI = process.env.MONGODB_URI!;

if (!MONGODB_URI) {
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Global is used here to maintain a cached connection across hot-reloads in development.
 * This prevents connections from growing exponentially during local code changes.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

export const connectDB = async () => {
  // 1. Check if we already have an active cached connection
  if (cached.conn) {
    console.log("Using cached MongoDB connection");
    return cached.conn;
  }

  // 2. If no connection promise exists, create a new one
  if (!cached.promise) {
    const opts = {
      bufferCommands: false, // Disable Mongoose buffering to fail fast if connection drops
    };

    console.log("Creating new MongoDB connection pool...");
    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      return mongooseInstance;
    });
  }

  // 3. Await the connection promise and store the resolved connection
  try {
    cached.conn = await cached.promise;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    cached.promise = null; // Reset the promise on failure so we can retry on the next request
    console.error("MongoDB Connection Error:", error);
    
    // Interview tip: NEVER use process.exit(1) in a serverless environment. 
    // Exiting the process will crash the serverless container instance, causing subsequent requests 
    // to fail and triggering cold starts. Instead, throw the error so the API Route handles it gracefully.
    throw error;
  }

  return cached.conn;
};