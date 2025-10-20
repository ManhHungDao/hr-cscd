import mongoose from "mongoose";

export async function connectDB(uri) {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(uri, { dbName: "hr_cscd" });
    console.log("[DB] Mongo connected:", uri);
  } catch (err) {
    console.error("[DB] Connection error:", err.message);
    process.exit(1);
  }
}
