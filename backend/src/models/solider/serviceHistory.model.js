import mongoose from "mongoose";
const { Schema } = mongoose;

const ServiceHistorySchema = new Schema(
  {
    // 🔗 Liên kết với chiến sĩ
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },

    // 🎯 Thông tin chính trị - ngành nghề
    partyJoinedDate: { type: Date, default: null }, // 📅 Ngày vào Đảng
    policeJoinedDate: { type: Date, default: null }, // 🪖 Ngày vào Công an

    // 🗓️ Thời gian công tác
    from: { type: Date, required: true },
    to: { type: Date, default: null },

    // 🏢 Đơn vị / tuyến công tác
    unitPath: { type: String, required: true }, // VD: "PK02/Đội Tuần tra/Tiểu đội A"

    // 💼 Chức vụ đảm nhiệm
    position: { type: String, required: true }, // VD: "Chiến sĩ", "Tổ trưởng", ...

    // 📄 Thông tin quyết định
    decisionNo: String,
    decisionDate: Date,

    // 📝 Ghi chú thêm
    note: String,
  },
  { timestamps: true }
);

// ✅ Index giúp truy vấn nhanh theo soldier và thời gian
ServiceHistorySchema.index({ soldierId: 1, from: -1 });

export default mongoose.model("ServiceHistory", ServiceHistorySchema);
