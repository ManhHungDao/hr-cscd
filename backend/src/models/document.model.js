// models/Document.js

import mongoose from "mongoose";
const { Schema } = mongoose;

const DocumentSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Tên tài liệu là bắt buộc"],
      trim: true,
    },
    type: {
      type: String,
      required: true,
      enum: {
        values: ["Quyết định", "Công văn", "Báo cáo", "Hình ảnh", "Khác"],
        message: "Loại tài liệu không hợp lệ",
      },
      index: true, // Index để lọc nhanh theo loại
    },
    category: {
      type: String,
      required: true,
      trim: true,
      index: true, // Index để lọc nhanh theo danh mục
    },
    security: {
      type: String,
      required: true,
      enum: {
        values: ["Công khai", "Nội bộ", "Mật", "Tối mật", "Tuyệt mật"],
        message: "Độ bảo mật không hợp lệ",
      },
      default: "Công khai", // Đặt giá trị mặc định
      index: true,
    },
    url: {
      type: String,
      required: [true, "Đường dẫn file (url) là bắt buộc"],
      // Đây là đường dẫn thực tế tới file (ví dụ: S3, Google Cloud Storage,...)
    },
    preview: {
      type: String, // Có thể là data-URL hoặc link tới ảnh thumbnail
      trim: true,
    },
    notes: {
      type: String,
      trim: true,
    },

    // ⭐️ TRƯỜNG MỚI ĐƯỢC THÊM THEO YÊU CẦU
    expiresAt: {
      type: Date,
      default: null, // Mặc định là null (không hết hạn)
      index: true, // Index để tìm kiếm văn bản sắp/đã hết hạn
    },
  },
  {
    timestamps: true,
  }
);

// Index dạng TEXT (Full-text search)
DocumentSchema.index({
  name: "text",
  notes: "text",
});

// Tạo và export model
const Document = mongoose.model("Document", DocumentSchema);

export default Document;
