// src/models/Training.js
import mongoose from "mongoose";
const { Schema } = mongoose;

const TrainingSchema = new Schema(
  {
    // 🔗 Liên kết chiến sĩ
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },

    // 🧩 Loại hình (Đào tạo / Huấn luyện)
    type: {
      type: String,
      enum: ["Đào tạo", "Huấn luyện"], // training = đào tạo, drill = huấn luyện
      required: true,
    },

    // 📘 Tên khóa học / đợt huấn luyện
    courseName: { type: String, required: true },

    // 🏫 Đơn vị tổ chức
    provider: { type: String },

    // 📍 Địa điểm học / huấn luyện
    location: { type: String },

    // 🗓️ Thời gian diễn ra
    from: { type: Date, required: true },
    to: { type: Date, default: null }, // null nếu vẫn đang diễn ra

    // ⏱️ Tổng số giờ
    hours: { type: Number, default: 0 },

    // 🎓 Chứng chỉ / giấy chứng nhận
    certificate: { type: String, default: "" },

    // 📊 Điểm số / kết quả
    score: { type: Number, default: null },
    result: {
      type: String,
      default: "Chưa đánh giá",
    },

    // 📄 Quyết định cử đi / kế hoạch
    decisionNo: String,
    decisionDate: Date,

    // 📝 Ghi chú
    note: String,
  },
  { timestamps: true }
);

// ✅ Chỉ mục tối ưu cho truy vấn lịch sử huấn luyện theo thời gian
TrainingSchema.index({ soldierId: 1, from: -1 });

export const Soldier = mongoose.model("Training", TrainingSchema);
