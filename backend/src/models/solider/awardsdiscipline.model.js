import mongoose from "mongoose";
const { Schema } = mongoose;

const AwardsDisciplineSchema = new Schema(
  {
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ["Khen thưởng", "Kỷ luật"],
      default: "Khen thưởng",
      required: true,
    },
    title: { type: String, required: true }, // Tiêu đề khen thưởng/kỷ luật,
    reason: String, // Lý do khen thưởng
    violation: String, // Vi phạm (dành cho kỷ luật)
    issuer: { type: String, required: true }, // Cơ quan/Người ra quyết định,
    decisionNo: { type: String, required: true }, // Số quyết định,
    decisionDate: { type: Date, required: true }, // Ngày ra quyết định,
    note: String, // Ghi chú thêm
  },
  { timestamps: true }
);
DepartmentSchema.index({ soldierId: 1, createdAt: -1 });

export default mongoose.model("AwardsDiscipline", DepartmentSchema);
