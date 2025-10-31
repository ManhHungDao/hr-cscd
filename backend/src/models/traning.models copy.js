// models/Training.js

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema cho Huấn luyện viên
const CoachSchema = new Schema(
  {
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      // Thêm index ở đây để tối ưu hóa tra cứu ngược từ Soldier
      index: true,
    },
    role: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

// Schema cho Học viên
const ParticipantSchema = new Schema(
  {
    soldierId: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      // Thêm index ở đây để tối ưu hóa tra cứu ngược từ Soldier
      index: true,
    },
  },
  { _id: false }
);

// Schema cho Mốc kiểm tra
const CheckpointSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    when: {
      type: Date,
      required: true,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false }
);

/**
 * ---------------------------------
 * SCHEMA CHÍNH (Training)
 * ---------------------------------
 */
const TrainingSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["Sắp diễn ra", "Đang diễn ra", "Kết thúc"],
      },
      default: "Đang diễn ra",
    },
    startAt: {
      type: Date,
      required: true,
    },
    endAt: {
      type: Date,
      required: true,
    },
    duration: {
      // Số buổi
      type: Number,
    },
    location: {
      type: String,
      trim: true,
    },
    content: {
      type: String,
      trim: true,
    },
    coaches: [CoachSchema],
    participants: [ParticipantSchema],
    modules: [String], // liệt kê các học phần, chủ đề, hoặc nội dung chính
    checkpoints: [CheckpointSchema],
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ---------------------------------
 * ⚡ TỐI ƯU HÓA INDEX (ĐÁNH CHỈ MỤC)
 * ---------------------------------
 */

// 1. Index kết hợp cho truy vấn/sắp xếp phổ biến nhất:
// Tối ưu cho việc tìm kiếm "Các khóa huấn luyện [Đang diễn ra], sắp xếp theo ngày bắt đầu mới nhất"
TrainingSchema.index({ status: 1, startAt: -1 });

// 2. Index cho tìm kiếm theo ngày bắt đầu (hỗ trợ lọc theo khoảng thời gian)
TrainingSchema.index({ startAt: 1 });

// 3. Index cho các mảng chứa ID tham chiếu (đã thêm ở schema con)
// Các index trên `participants.soldierId` và `coaches.soldierId` (đã thêm ở trên)
// là cực kỳ quan trọng để tìm kiếm: "Tìm các khóa huấn luyện mà chiến sĩ X tham gia"

// 4. Index cho mảng 'modules'
// Tối ưu cho việc tìm "Các khóa huấn luyện có học phần 'Kỹ thuật tiếp cận'"
TrainingSchema.index({ modules: 1 });

// 5. Index dạng TEXT (Full-text search)
// Tối ưu cho thanh tìm kiếm chung, cho phép tìm kiếm theo từ khóa trong tên, nội dung, địa điểm
TrainingSchema.index({
  name: "text",
  content: "text",
  location: "text",
});

// Tạo và export model
const Training = mongoose.model("Training", TrainingSchema);

module.exports = Training;
