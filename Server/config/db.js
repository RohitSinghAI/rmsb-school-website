const mongoose = require("mongoose");

const db = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 5000, // ⏱️ stop waiting forever
      socketTimeoutMS: 45000,         // ⏱️ long queries safety
      maxPoolSize: 10,                // 🔁 connection pooling
    });

    console.log("✅ MongoDB connected successfully");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
};

module.exports = db;
