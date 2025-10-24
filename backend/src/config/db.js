const mongoose = require("mongoose");

const connectDB = async (uri) => {
  mongoose.set("strictQuery", true);
  await mongoose.connect(uri, {
    autoIndex: true,
    serverSelectionTimeoutMS: 10000,
  });
  console.log("✅ MongoDB connected:", mongoose.connection.name);
  mongoose.connection.on("error", (err) => {
    console.error("MongoDB error:", err?.message || err);
  });
};

module.exports = { connectDB };
