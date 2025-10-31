const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const InventoryItemSchema = new Schema(
  {
    code: {
      type: String,
      unique: true, // Đảm bảo mã này là duy nhất
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: ["Vũ khí", "Trang bị", "Công cụ hỗ trợ", "Khác"],
      },
      index: true, // Index để lọc theo loại
    },
    quantity: {
      type: Number,
      required: true,
      min: [0, "Số lượng không thể âm"],
      default: 0,
    },
    unit: {
      type: String,
      enum: {
        values: ["Cái", "Bộ", "Chiếc", "Quả", "Viên", "Khác"],
      },
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        // Các trạng thái phổ biến của vật tư
        values: ["Tốt", "Hư", "Bảo dưỡng", "Thanh lý"],
      },
      default: "Tốt",
      index: true, // Index để lọc theo trạng thái
    },
    receivedAt: {
      type: Date, // Sử dụng kiểu Date để dễ dàng truy vấn khoảng thời gian
      default: Date.now,
    },
    note: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index cho tìm kiếm Full-text (tìm theo từ khóa)
InventoryItemSchema.index({
  name: "text",
  code: "text",
  note: "text",
});

// Tạo và export model
// Tên model nên là số ít (ví dụ: 'InventoryItem')
// Mongoose sẽ tự động tạo collection tên là 'inventoryitems' (số nhiều)
const InventoryItem = mongoose.model("InventoryItem", InventoryItemSchema);

module.exports = InventoryItem;
