// src/models/RelatedFile.js
import mongoose from "mongoose";

const { Schema } = mongoose;

/** Enums (có thể dùng chung toàn dự án) */
export const DOC_TYPES = [
  "Hồ sơ", // báo cáo / hồ sơ
  "Quyết định", // quyết định
  "Hợp Đồng", // hợp đồng
  "Tài liệu huấn luyện", // tài liệu huấn luyện
  "Khen thưởng", // kỷ luật
  "Kỷ luật", // khen thưởng
  "Khác", // khác
];

// export const SECURITY_LEVELS = [
//   "public",        // công khai nội bộ hệ thống
//   "internal",      // nội bộ đơn vị/phòng
//   "confidential",  // mật
//   "secret",        // tối mật
// ];

const RelatedFileSchema = new Schema(
  {
    clientKey: {
      type: String,
      trim: true,
      index: true, // tra cứu nhanh theo id phía client (vd: "rf_001")
    },

    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 300,
    },

    type: {
      type: String,
      enum: DOC_TYPES,
      default: "Khác",
      index: true,
    },

    note: {
      type: String,
      trim: true,
      maxlength: 2000,
    },

    uploadedAt: {
      type: Date,
      default: Date.now,
      index: true,
    },

    // Thông tin file
    fileName: {
      type: String,
      required: true,
      trim: true,
      maxlength: 255,
    },
    mime: {
      type: String,
      required: true,
      trim: true,
      maxlength: 100,
    },

    // handle lưu phía client (IndexedDB) – có thể null
    handleId: {
      type: String,
      default: null,
      trim: true,
      index: true,
    },
  },
  {
    timestamps: true, // createdAt, updatedAt
  }
);

/** Index gợi ý: lọc theo soldierId + type theo thời gian */
RelatedFileSchema.index({ soldierId: 1, type: 1, uploadedAt: -1 });

/** Text index để tìm nhanh theo tiêu đề/ghi chú */
RelatedFileSchema.index({ title: "text", note: "text" });

export default mongoose.model("RelatedFile", RelatedFileSchema);
