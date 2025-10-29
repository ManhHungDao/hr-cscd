import mongoose from "mongoose";
const { Schema } = mongoose;

const DepartmentSchema = new Schema(
  {
    // 🧑‍✈️ Thông tin chiến sĩ phụ trách đơn vị
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },

    name: { type: String, required: true }, // Tên đơn vị
    code: String, // Mã đơn vị (ví dụ: PK02)
    type: {
      type: String,
      enum: ["Phòng", "Đội", "Tiểu đội", "Khác"],
      default: "Đội",
      required: true,
    },
    description: String, // Ghi chú mô tả đơn vị

    // 🪖 Cấp bậc của người phụ trách
    rank: {
      type: String,
      enum: [
        "Binh nhất",
        "Binh nhì",
        "Hạ sĩ",
        "Trung sĩ",
        "Thượng sĩ",
        "Thiếu úy",
        "Trung úy",
        "Thượng úy",
        "Đại úy",
        "Thiếu tá",
        "Trung tá",
        "Thượng tá",
        "Đại tá",
      ],
      default: "Chiến sĩ",
    },

    // 📋 Chức vụ trong đơn vị
    position: {
      type: String,
      enum: [
        "Trưởng phòng",
        "Phó phòng",
        "Đội trưởng",
        "Phó đội trưởng",
        "Cán bộ",
        "Chiến sĩ",
      ],
      default: "Chiến sĩ",
    },
  },
  { timestamps: true }
);

// ⚡ Tối ưu chỉ mục: mỗi chiến sĩ có thể phụ trách nhiều đơn vị, ưu tiên theo thời gian gần nhất
DepartmentSchema.index({ soldierId: 1, createdAt: -1 });

export default mongoose.model("Department", DepartmentSchema);
