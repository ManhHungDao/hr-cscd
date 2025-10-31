// src/models/DutySchedule.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/** Ca trực (shift) */
const ShiftSchema = new Schema(
  {
    startShift: { type: String, required: true },
    endShift: { type: String, required: true },
    teamSize: { type: Number, required: true, min: 1, max: 10, default: 2 },
    soldiers: {
      type: [Schema.Types.ObjectId],
      ref: "Soldier",
      required: true,
      default: [],
    },
  },
  { _id: true }
);

/** Lịch trực của 1 mục tiêu trong ngày */
const TargetScheduleSchema = new Schema(
  {
    departmentId: {
      type: Schema.Types.ObjectId,
      ref: "TargetDepartment",
      required: true,
      index: true, // <-- Tốt: Hỗ trợ tìm theo mục tiêu
    },
    shifts: { type: [ShiftSchema], default: [] },
  },
  { _id: true }
);

/** Document lịch trực theo NGÀY (1 ngày = 1 document) */
const DutyScheduleSchema = new Schema(
  {
    date: { type: String, required: true, index: true }, // <-- Tốt: Hỗ trợ tìm theo ngày
    dayCommander: {
      type: Schema.Types.ObjectId,
      ref: "Soldier",
      required: true,
      index: true, // <-- Tốt: Hỗ trợ tìm theo chỉ huy
    },
    targets: { type: [TargetScheduleSchema], default: [] },
  },
  { timestamps: true }
);

// --- CÁC INDEX TỐI ƯU HÓA TRUY VẤN ---

/**
 * 1. Index phức hợp (Compound Index)
 * Tối ưu cho truy vấn tìm lịch trực của một MỤC TIÊU cụ thể trong một NGÀY cụ thể.
 * Đây là truy vấn rất phổ biến: `db.dutyschedules.find({ date: "2023-10-30", "targets.departmentId": ObjectId(...) })`
 * Index này cũng bao gồm (covers) luôn truy vấn chỉ tìm theo `date`.
 */
DutyScheduleSchema.index({ date: 1, "targets.departmentId": 1 });

/**
 * 2. Index đa khóa (Multikey Index)
 * Tối ưu cho truy vấn tìm tất cả các ngày trực của một CHIẾN SĨ cụ thể (bất kể ở mục tiêu hay ca nào).
 * Hỗ trợ truy vấn: `db.dutyschedules.find({ "targets.shifts.soldiers": ObjectId(...) })`
 */
DutyScheduleSchema.index({ "targets.shifts.soldiers": 1 });

// ----------------------------------------

export default mongoose.model("DutySchedule", DutyScheduleSchema);
