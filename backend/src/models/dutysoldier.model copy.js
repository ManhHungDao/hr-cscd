// src/models/DutySchedule.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/** Ảnh chụp (snapshot) thông tin chiến sĩ vào thời điểm lập lịch */
const SoldierSnapshotSchema = new Schema(
  {
    soldierId: { type: Schema.Types.ObjectId, ref: "Soldier", index: true }, // nếu có collection Soldiers
    externalId: { type: String, trim: true }, // mã/ID nghiệp vụ (nếu khác _id)
    name: { type: String, trim: true, required: true },
    badge: { type: String, trim: true },
    phone: { type: String, trim: true },
  },
  { _id: false }
);

/** Slot = 1 khung giờ nhỏ thuộc 1 ca */
const SlotSchema = new Schema(
  {
    startMin: { type: Number, required: true, min: 0, max: 1440 }, // phút tính từ 00:00
    endMin: { type: Number, required: true, min: 0, max: 1440 },
    soldiers: { type: [SoldierSnapshotSchema], default: [] }, // đúng teamSize người
  },
  { _id: false }
);

/** Ca trực (shift) */
const ShiftSchema = new Schema(
  {
    label: { type: String, trim: true }, // "Ca ngày", "Ca đêm", ...
    fromMin: { type: Number, required: true, min: 0, max: 1440 },
    toMin: { type: Number, required: true, min: 0, max: 1440 },
    slotMinutes: {
      type: Number,
      required: true,
      min: 15,
      max: 720,
      default: 120,
    },
    teamSize: { type: Number, required: true, min: 1, max: 10, default: 2 },
    pool: { type: [SoldierSnapshotSchema], default: [] }, // danh sách người có thể phân
    slots: { type: [SlotSchema], default: [] }, // có thể để trống → model tự generate
  },
  { _id: true }
);

/** Lịch trực của 1 mục tiêu trong ngày */
const TargetScheduleSchema = new Schema(
  {
    targetId: { type: String, trim: true }, // hoặc ObjectId nếu có collection Targets
    name: { type: String, trim: true, required: true },
    location: { type: String, trim: true },
    commander: CommanderSchema,
    shifts: { type: [ShiftSchema], default: [] },
  },
  { _id: true }
);

/** Document lịch trực theo NGÀY (1 ngày = 1 document) */
const DutyScheduleSchema = new Schema(
  {
    date: { type: String, required: true, index: true }, // ISO "YYYY-MM-DD"
    dayCommander: CommanderSchema, // chỉ huy trực NGÀY (toàn đơn vị)
    targets: { type: [TargetScheduleSchema], default: [] },
    note: { type: String, trim: true },
  },
  { timestamps: true }
);

/* ─────────── Indexes & Uniqueness ─────────── */

DutyScheduleSchema.index({ date: 1 }, { unique: true }); // 1 ngày chỉ 1 doc
DutyScheduleSchema.index({ date: 1, "targets.targetId": 1 });
DutyScheduleSchema.index({
  date: 1,
  "targets.shifts.fromMin": 1,
  "targets.shifts.toMin": 1,
});

/* ─────────── Helpers (nội bộ model) ─────────── */

function overlaps(aStart, aEnd, bStart, bEnd) {
  return Math.max(aStart, bStart) < Math.min(aEnd, bEnd);
}

function buildSlots(fromMin, toMin, slotMinutes) {
  const out = [];
  for (let t = fromMin; t < toMin; t += slotMinutes) {
    const end = Math.min(t + slotMinutes, toMin);
    out.push({ startMin: t, endMin: end, soldiers: [] });
  }
  return out;
}

function pairRotation(pool, teamSize) {
  const res = [];
  let i = 0;
  while (i < pool.length) {
    const grp = pool.slice(i, i + teamSize);
    if (grp.length < teamSize && pool.length) {
      grp.push(...pool.slice(0, teamSize - grp.length)); // mượn từ đầu nếu thiếu
    }
    res.push(grp);
    i += teamSize;
  }
  return res.length ? res : [pool.slice(0, teamSize)];
}

function assignSoldiersToSlots(slots, pool, teamSize) {
  const teams = pairRotation(pool, teamSize);
  return slots.map((slot, idx) => ({
    ...slot,
    soldiers: teams[idx % teams.length],
  }));
}

/* ─────────── Validations & Auto-generation ─────────── */

/** Không trùng thời gian ca trong CÙNG một mục tiêu */
function ensureNoOverlap(shifts) {
  const arr = (shifts || [])
    .map((s) => ({ from: s.fromMin, to: s.toMin }))
    .sort((a, b) => a.from - b.from);
  for (let i = 1; i < arr.length; i++) {
    if (overlaps(arr[i - 1].from, arr[i - 1].to, arr[i].from, arr[i].to))
      return false;
  }
  return true;
}

/** Trước khi validate:
 *  - generate slots nếu chưa có,
 *  - kiểm tra không trùng ca,
 *  - đảm bảo mỗi slot có đúng teamSize người.
 */
DutyScheduleSchema.pre("validate", function (next) {
  try {
    for (const tgt of this.targets || []) {
      if (!ensureNoOverlap(tgt.shifts)) {
        throw new Error(
          `Ca trực của mục tiêu "${tgt.name}" bị trùng thời gian.`
        );
      }
      for (const sh of tgt.shifts || []) {
        if (!Array.isArray(sh.pool) || sh.pool.length === 0) {
          throw new Error(
            `Shift "${sh.label || ""}" của "${
              tgt.name
            }" chưa có danh sách chiến sĩ (pool).`
          );
        }
        // Tự sinh slots nếu để trống
        if (!sh.slots || sh.slots.length === 0) {
          const slots = buildSlots(sh.fromMin, sh.toMin, sh.slotMinutes);
          sh.slots = assignSoldiersToSlots(slots, sh.pool, sh.teamSize);
        }
        // Mỗi slot phải đủ người
        for (const sl of sh.slots) {
          if ((sl.soldiers || []).length !== sh.teamSize) {
            throw new Error(
              `Một slot trong shift "${sh.label || ""}" của "${
                tgt.name
              }" chưa đủ số chiến sĩ (teamSize=${sh.teamSize}).`
            );
          }
        }
      }
    }
    next();
  } catch (e) {
    next(e);
  }
});

/* ─────────── Virtuals tiện hiển thị ─────────── */

ShiftSchema.virtual("fromHHMM").get(function () {
  const h = String(Math.floor(this.fromMin / 60)).padStart(2, "0");
  const m = String(this.fromMin % 60).padStart(2, "0");
  return `${h}:${m}`;
});
ShiftSchema.virtual("toHHMM").get(function () {
  const h = String(Math.floor(this.toMin / 60)).padStart(2, "0");
  const m = String(this.toMin % 60).padStart(2, "0");
  return `${h}:${m}`;
});

/* ─────────── Export model ─────────── */

export default mongoose.model("DutySchedule", DutyScheduleSchema);
