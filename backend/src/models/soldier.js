// src/models/Soldier.js
import mongoose from "mongoose";
const { Schema } = mongoose;

/* =======================
 * Common Sub-schemas
 * ======================= */
const PhoneSchema = new Schema(
  { label: String, number: String },
  { _id: false }
);

const EmailSchema = new Schema(
  { label: String, address: String },
  { _id: false }
);

const AddressSchema = new Schema(
  {
    line: String,
    ward: String,
    province: String,
  },
  { _id: false }
);

/* =======================
 * Career / Position
 * ======================= */
const RankPositionSchema = new Schema(
  {
    rank: {
      type: String,
      enum: [
        // Hạ sĩ quan - Chiến sĩ
        "Binh nhất",
        "Binh nhì",
        "Hạ sĩ",
        "Trung sĩ",
        "Thượng sĩ",
        // Cấp úy
        "Thiếu úy",
        "Trung úy",
        "Thượng úy",
        "Đại úy",
        // Cấp tá
        "Thiếu tá",
        "Trung tá",
        "Thượng tá",
        "Đại tá",
        // Cấp tướng
        "Thiếu tướng",
        "Trung tướng",
        "Thượng tướng",
        "Đại tướng",
        // Dự phòng
        "Không xác định",
      ],
      default: "Binh nhì",
    },
    position: String,
    from: { type: Date },
    to: { type: Date },
  },
  { _id: false }
);

/* =======================
 * Identity / Party
 * ======================= */
const IdentityDocsSchema = new Schema(
  {
    policeCode: { type: String, index: true },
    cccd: String,
    cccdIssuedAt: { type: Date },
    cccdIssuedPlace: String,
  },
  { _id: false }
);

const PartyInfoSchema = new Schema(
  {
    joinedPoliceAt: { type: Date },
    joinedPartyAt: { type: Date },
  },
  { _id: false }
);

/* =======================
 * Demographics / Contact
 * ======================= */
const DemographicsSchema = new Schema(
  {
    birthDate: { type: Date },
    birthPlace: String,
    hometown: String,
    permanentAddress: AddressSchema, // thống nhất kiểu AddressSchema
    currentAddress: AddressSchema,
    bloodType: {
      type: String,
      enum: ["A", "B", "AB", "O", "Unknown"],
      default: "Unknown",
    },
    religion: String,
    maritalStatus: {
      type: String,
      enum: ["Độc thân", "Kết hôn", "Khác"],
    },
    childrenCount: Number,
  },
  { _id: false }
);

const ContactInfoSchema = new Schema(
  {
    phones: { type: [PhoneSchema], default: [] },
    emails: { type: [EmailSchema], default: [] },
    emergencyContact: { name: String, relation: String, phone: String },
  },
  { _id: false }
);

/* =======================
 * Education / Skills
 * ======================= */
const EducationSchema = new Schema(
  {
    degree: String,
    major: String,
    mode: {
      // đã loại bỏ "Tại chức" trùng
      type: String,
      enum: [
        "Chính quy",
        "Liên thông",
        "Tại chức",
        "Văn bằng 2",
        "Đào tạo từ xa",
        "Khác",
      ],
      default: "Chính quy",
    },
    grade: {
      type: String,
      enum: ["Xuất sắc", "Giỏi", "Khá", "Trung bình", "Khác"],
      default: "Khác",
    },
    graduationYear: Number,
    institution: String,
    secondDegree: {
      major: String,
      institution: String,
      year: Number,
    },
  },
  { _id: false }
);

const LanguageSchema = new Schema(
  { name: String, level: String },
  { _id: false }
);

const SkillsSchema = new Schema(
  {
    politicsLevel: String,
    itLevel: String,
    language: { type: [LanguageSchema], default: [] },
    qpanLevel: String,
    drivingLicense: String, // cân nhắc chuẩn hoá A1/A2/B1/B2...
  },
  { _id: false }
);

/* =======================
 * Training / History / Salary
 * ======================= */
const TrainingItemSchema = new Schema(
  {
    name: { type: String, required: true },
    time: { type: Date },
    place: String,
    certNo: String,
    score: String,
    note: String,
  },
  { _id: false }
);

const ServiceHistoryItemSchema = new Schema(
  {
    from: { type: Date, required: true },
    to: { type: Date },
    unitPath: String,
    position: String,
    decisionNo: String,
    note: String,
  },
  { _id: false }
);

const PromotionItemSchema = new Schema(
  {
    date: { type: Date },
    fromRank: String,
    toRank: String,
    decisionNo: String,
  },
  { _id: false }
);

const SalaryStepItemSchema = new Schema(
  {
    date: { type: Date },
    coefficient: Number,
    decisionNo: String,
  },
  { _id: false }
);

/* =======================
 * Awards / Disciplines
 * ======================= */
const AwardItemSchema = new Schema(
  {
    date: { type: Date },
    title: String,
    decisionNo: String,
    note: String,
  },
  { _id: false }
);

const DisciplineItemSchema = new Schema(
  {
    date: { type: Date },
    form: String, // có thể thêm enum nếu nghiệp vụ yêu cầu
    reason: String,
    decisionNo: String,
    note: String,
  },
  { _id: false }
);

/* =======================
 * Attendance (đổi sang mảng)
 * ======================= */
const AttendanceSchema = new Schema(
  {
    period: {
      from: { type: Date },
      to: { type: Date },
    },
    source: String,
    note: String,
  },
  { _id: false }
);

/* =======================
 * Documents (metadata only)
 * ======================= */
const DocumentItemSchema = new Schema(
  {
    // Thông tin hiển thị
    name: { type: String, required: true },
    note: String,

    // Phân loại
    type: {
      type: String,
      enum: ["image", "pdf", "doc", "sheet", "other"],
      default: "other",
    },
    tags: { type: [String], default: [] },

    // Metadata file thực tế
    originalName: String,
    storedName: String, // nên đảm bảo không trùng trong hệ thống
    extension: String,
    mimeType: String,
    size: Number,
    checksum: String, // tuỳ chọn

    // Lưu trữ
    storageType: { type: String, enum: ["local"], default: "local" },
    baseDir: { type: String, default: "uploads" },
    relativePath: String,
    url: String,

    // Upload info
    uploadedAt: { type: Date, default: Date.now },
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { _id: false }
);

/* =======================
 * Family
 * ======================= */
const ChildSchema = new Schema(
  {
    name: String,
    birthDate: { type: Date },
    gender: { type: String, enum: ["Nam", "Nữ", "Khác"], default: "Khác" },
    school: String,
    note: String,
  },
  { _id: false }
);

const ParentsSchema = new Schema(
  {
    fatherName: String,
    fatherBirthYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    fatherStatus: String,
    motherName: String,
    motherBirthYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    motherStatus: String,
    address: String,
    phone: String,
  },
  { _id: false }
);

const FamilySchema = new Schema(
  {
    maritalStatus: { type: String, enum: ["Độc thân", "Kết hôn", "Khác"] },
    marriageDate: { type: Date },
    spouseName: String,
    spouseBirthYear: { type: Number, min: 1900, max: new Date().getFullYear() },
    spouseOccupation: String,
    spouseWorkplace: String,
    spousePhone: String,
    children: { type: [ChildSchema], default: [] },
    parents: ParentsSchema,
    householdRegistration: String,
    householdMembers: {
      type: [
        new Schema(
          {
            name: String,
            relation: String,
            birthYear: {
              type: Number,
              min: 1900,
              max: new Date().getFullYear(),
            },
          },
          { _id: false }
        ),
      ],
      default: [],
    },
    nextOfKin: { name: String, relation: String, phone: String },
    familyPolicyStatus: String,
    familyNotes: String,
  },
  { _id: false }
);

/* =======================
 * Soldier (root)
 * ======================= */
const SoldierSchema = new Schema(
  {
    avatar: String,
    fullName: { type: String, required: true, index: true },
    current: RankPositionSchema,
    unitPath: String,

    identityDocs: IdentityDocsSchema,
    demographics: DemographicsSchema,
    contact: ContactInfoSchema,
    party: PartyInfoSchema,

    education: EducationSchema,
    skills: SkillsSchema,
    trainings: { type: [TrainingItemSchema], default: [] },

    serviceHistory: { type: [ServiceHistoryItemSchema], default: [] },
    promotions: { type: [PromotionItemSchema], default: [] },
    salarySteps: { type: [SalaryStepItemSchema], default: [] },

    awards: { type: [AwardItemSchema], default: [] },
    disciplines: { type: [DisciplineItemSchema], default: [] },

    attendances: { type: [AttendanceSchema], default: [] }, // ĐÃ đổi sang mảng
    documents: { type: [DocumentItemSchema], default: [] },

    family: FamilySchema,

    notes: String,
  },
  { timestamps: true }
);

/* =======================
 * Indexes
 * ======================= */

// Tên + mã + đơn vị (cơ bản)
SoldierSchema.index({
  fullName: "text",
  "identityDocs.policeCode": 1,
  unitPath: 1,
  updatedAt: -1,
});

// Tổ chức & chức vụ hiện tại
SoldierSchema.index({ unitPath: 1, "current.rank": 1, "current.position": 1 });

// Mốc thời gian để lọc/sort
SoldierSchema.index({ "serviceHistory.from": 1, "serviceHistory.to": 1 });
SoldierSchema.index({ "promotions.date": -1 });
SoldierSchema.index({ "salarySteps.date": -1 });
SoldierSchema.index({ "awards.date": -1 });
SoldierSchema.index({ "disciplines.date": -1 });
SoldierSchema.index({ "trainings.time": -1 });

// Tài liệu (nếu vẫn embed, hỗ trợ lọc theo tag & thời gian)
SoldierSchema.index({ "documents.tags": 1, "documents.uploadedAt": -1 });
SoldierSchema.index(
  { "documents.storedName": 1 },
  { unique: true, sparse: true }
);

// Mã ngành/CCCD duy nhất nhưng cho phép trống (partial unique)
SoldierSchema.index(
  { "identityDocs.policeCode": 1 },
  {
    unique: true,
    partialFilterExpression: { "identityDocs.policeCode": { $type: "string" } },
  }
);
SoldierSchema.index(
  { "identityDocs.cccd": 1 },
  {
    unique: true,
    partialFilterExpression: { "identityDocs.cccd": { $type: "string" } },
  }
);

export const Soldier = mongoose.model("Soldier", SoldierSchema);
