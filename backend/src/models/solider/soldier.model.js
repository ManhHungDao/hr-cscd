// src/models/Soldier.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const IdentitySchema = new Schema(
  {
    cccd: String,
    cccdIssuedAt: { type: Date },
    cccdIssuedPlace: String,
  },
  { _id: false }
);

const ImageSchema = new Schema(
  {
    name: String,
    data: Buffer,
    contentType: String,
  },
  { _id: false }
);

const SoldierSchema = new Schema(
  {
    // 🧍‍♂️ Thông tin cơ bản
    fullName: { type: String, required: true, index: true },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Nam" },
    birthDate: { type: Date },
    birthPlace: String,
    hometown: String,

    // 🏠 Địa chỉ
    permanentAddress: String, // sau này có thể thay bằng AddressSchema
    currentAddress: String,

    // 🪪 Thông tin định danh
    identity: IdentitySchema,

    // 💉 Thông tin sức khỏe
    bloodType: {
      type: String,
      enum: ["A", "B", "AB", "O", "Chưa biết"],
      default: "Chưa biết",
    },

    // 🕊️ Tôn giáo, hôn nhân
    religion: String,
    maritalStatus: {
      type: String,
      enum: ["Độc thân", "Kết hôn", "Khác"],
    },

    // 📞 Liên lạc
    email: String,
    phone: String,

    // 🖼️ Ảnh và ghi chú
    avatar: ImageSchema,
    notes: String,
  },
  { timestamps: true }
);

export const Soldier = mongoose.model("Soldier", SoldierSchema);
