import mongoose from "mongoose";
const { Schema } = mongoose;

const FamilySchema = new Schema(
  {
    // 🔗 Mối quan hệ với chiến sĩ
    related: {
      type: String,
      enum: ["Bố", "Mẹ", "Anh", "Chị", "Em", "Vợ", "Chồng", "Con"],
    },

    // 🧍‍♂️ Họ tên người thân
    fullName: { type: String },

    // 🗓️ Năm sinh (hoặc ngày sinh nếu có)
    birthDate: { type: Date },

    // 💼 Nghề nghiệp / nơi công tác
    occupation: String,
    workplace: String,

    // 🏠 Địa chỉ hiện tại
    address: String,

    // ☎️ Liên hệ
    phone: String,
    email: String,

    // ⚰️ Tình trạng (còn sống hay đã mất)
    aliveStatus: {
      type: String,
      enum: ["Còn sống", "Đã mất"],
      default: "Còn sống",
    },

    // 📋 Ghi chú thêm (ví dụ: người giám hộ, sống cùng, …)
    notes: String,

    // 🪪 Nếu cần liên kết với soldier chính (trong trường hợp nhiều chiến sĩ có chung người thân)
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);
FamilySchema.index({ soldierId: 1, from: -1 });

export const Soldier = mongoose.model("Family", FamilySchema);
