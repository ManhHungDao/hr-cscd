import mongoose from "mongoose";
const SoldierSchema = new mongoose.Schema({
  name: { type: String, required: true },
  code: { type: String, required: true, unique: true },
  rank: { type: String, enum: ["Chiến sĩ", "Hạ sĩ", "Trung sĩ", "Thượng sĩ", "Thiếu úy", "Trung úy", "Thượng úy", "Đại úy"], default: "Chiến sĩ" },
  departmentId: { type: mongoose.Schema.Types.ObjectId, ref: "Department" },
  dob: Date,
  phone: String,
  address: String,
  avatarUrl: String,
  status: { type: String, enum: ["active", "inactive"], default: "active" }
}, { timestamps: true });
export default mongoose.model("Soldier", SoldierSchema);
