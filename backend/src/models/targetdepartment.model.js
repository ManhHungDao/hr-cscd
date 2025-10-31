// src/models/Soldier.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const TargetDepartmentSchema = new Schema(
  {
    name: { type: String, required: true, unique: true },
    address: String,
    note: String,
  },
  { timestamps: true }
);

export default mongoose.model("TargetDepartment", TargetDepartmentSchema);
