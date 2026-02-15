const mongoose = require("mongoose");

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
let listenersAttached = false;

const attachConnectionListeners = () => {
  if (listenersAttached) return;
  listenersAttached = true;

  mongoose.connection.on("connected", () => {
    console.log(`MongoDB event: connected (${mongoose.connection.host})`);
  });

  mongoose.connection.on("disconnected", () => {
    console.error("MongoDB event: disconnected");
  });

  mongoose.connection.on("reconnected", () => {
    console.log("MongoDB event: reconnected");
  });

  mongoose.connection.on("error", (error) => {
    console.error(`MongoDB event: error (${error.message})`);
  });
};

const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;
  const fallbackUri = process.env.MONGO_URI_FALLBACK;
  const uris = [primaryUri, fallbackUri].filter(Boolean);

  if (uris.length === 0) {
    throw new Error("Missing MONGO_URI in environment");
  }

  let lastError = null;
  const maxRetriesPerUri = Number(process.env.MONGO_CONNECT_RETRIES || 3);
  const retryDelayMs = Number(process.env.MONGO_CONNECT_RETRY_DELAY_MS || 2000);
  const serverSelectionTimeoutMS = Number(process.env.MONGO_SERVER_SELECTION_TIMEOUT_MS || 12000);
  const socketTimeoutMS = Number(process.env.MONGO_SOCKET_TIMEOUT_MS || 45000);
  attachConnectionListeners();

  for (const uri of uris) {
    for (let attempt = 1; attempt <= maxRetriesPerUri; attempt += 1) {
      try {
        const conn = await mongoose.connect(uri, {
          serverSelectionTimeoutMS,
          socketTimeoutMS,
          family: 4,
          maxPoolSize: Number(process.env.MONGO_MAX_POOL_SIZE || 10),
          minPoolSize: Number(process.env.MONGO_MIN_POOL_SIZE || 1),
        });
        console.log(`MongoDB connected: ${conn.connection.host}`);
        return conn;
      } catch (error) {
        lastError = error;
        console.error(`MongoDB connection failed (attempt ${attempt}/${maxRetriesPerUri}): ${error.message}`);
        if (attempt < maxRetriesPerUri) {
          const backoff = retryDelayMs * attempt;
          await sleep(backoff);
        }
      }
    }
  }

  throw new Error(`Unable to connect to MongoDB. Last error: ${lastError?.message || "Unknown error"}`);
};

module.exports = connectDB;
