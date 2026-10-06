const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  // If already connected in serverless cache, reuse connection
  if (isConnected && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGODB_URI;

  // If no URI provided, log fallback status
  if (!uri) {
    console.log('[Database] No MONGODB_URI detected in environment. Running in Online Zero-Config Memory Mode.');
    return null;
  }

  try {
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 4000, // Fast failover so serverless requests do not hang
    });
    isConnected = true;
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database Warning] Could not connect to external MongoDB (${error.message}). Falling back to Online In-Memory Engine.`);
    isConnected = false;
    return null;
  }
};

module.exports = connectDB;
