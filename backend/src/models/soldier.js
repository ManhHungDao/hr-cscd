import mongoose from "mongoose";
const { Schema } = mongoose;

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

const RankPositionSchema = new Schema(
  {
    rank: {
      type: String,
      enum: [
        // 🧩 Hạ sĩ quan - Chiến sĩ
        "Binh nhất",
        "Binh nhì",
        "Hạ sĩ",
        "Trung sĩ",
        "Thượng sĩ",

        // 🧩 Cấp úy
        "Thiếu úy",
        "Trung úy",
        "Thượng úy",
        "Đại úy",

        // 🧩 Cấp tá
        "Thiếu tá",
        "Trung tá",
        "Thượng tá",
        "Đại tá",

        // 🧩 Cấp tướng
        "Thiếu tướng",
        "Trung tướng",
        "Thượng tướng",
        "Đại tướng",

        // 🧩 Dự phòng (nếu có cán bộ đặc biệt hoặc dân sự)
        "Không xác định",
      ],
      default: "Binh nhì",
    },
    position: String,
    from: { type: Date }, // ✅ đổi sang Date
    to: { type: Date },
  },
  { _id: false }
);

const IdentityDocsSchema = new Schema(
  {
    policeCode: { type: String, index: true },
    cccd: String,
    cccdIssuedAt: { type: Date }, // ✅ Date
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

const DemographicsSchema = new Schema(
  {
    birthDate: { type: Date },
    birthPlace: String,
    hometown: String,
    permanentAddress: String,
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

const EducationSchema = new Schema(
  {
    degree: String,
    major: String,
    mode: {
      type: String,
      enum: [
        "Chính quy",
        "Liên thông",
        "Tại chức",
        "Văn bằng 2",
        "Tại chức",
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
    drivingLicense: String,
  },
  { _id: false }
);

const TrainingItemSchema = new Schema(
  {
    name: { type: String, required: true },
    time: { type: Date }, // ✅
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
    date: { type: Date }, // ✅
    fromRank: String,
    toRank: String,
    decisionNo: String,
  },
  { _id: false }
);

const SalaryStepItemSchema = new Schema(
  {
    date: { type: Date }, // ✅
    coefficient: Number,
    decisionNo: String,
  },
  { _id: false }
);

const AwardItemSchema = new Schema(
  {
    date: { type: Date }, // ✅
    title: String,
    decisionNo: String,
    note: String,
  },
  { _id: false }
);

const DisciplineItemSchema = new Schema(
  {
    date: { type: Date }, // ✅
    form: String,
    reason: String,
    decisionNo: String,
    note: String,
  },
  { _id: false }
);

const AttendanceSchema = new Schema(
  {
    period: {
      from: { type: Date }, // ✅
      to: { type: Date },
    },
    source: String,
    note: String,
  },
  { _id: false }
);

const DocumentItemSchema = new Schema(
  {
    /** 🔹 Thông tin cơ bản */
    name: { type: String, required: true }, // Tên hiển thị (VD: "Báo cáo tháng 10")
    note: { type: String }, // Ghi chú tùy chọn

    /** 🔹 Loại file & phân loại */
    type: {
      type: String,
      enum: ["image", "pdf", "doc", "sheet", "other"], // Loại tệp
      default: "other",
    },
    tags: { type: [String], default: [] }, // Từ khóa tìm kiếm (VD: ["báo cáo", "tài chính"])

    /** 🔹 Metadata của file thực tế (trên ổ đĩa) */
    originalName: String, // Tên gốc khi upload
    storedName: String, // Tên đã đổi khi lưu (để tránh trùng)
    extension: String, // Phần mở rộng (vd: ".pdf")
    mimeType: String, // Loại MIME (vd: "application/pdf")
    size: Number, // Kích thước file (bytes)
    checksum: String, // SHA256 để kiểm tra toàn vẹn file (tùy chọn)

    /** 🔹 Thông tin vị trí lưu trữ */
    storageType: {
      type: String,
      enum: ["local"], // Có thể mở rộng thêm: "s3", "gcs"
      default: "local",
    },
    baseDir: { type: String, default: "uploads" }, // Thư mục gốc (không lộ ổ đĩa thật)
    relativePath: String, // Đường dẫn tương đối (vd: "soldiers/<id>/<file>.pdf")

    /** 🔹 Tự động sinh URL khi render phía client (tùy backend) */
    url: String, // Đường dẫn hoặc API tải về (vd: "/api/files/xxx")

    /** 🔹 Thông tin tải lên */
    uploadedAt: { type: Date, default: Date.now }, // Ngày upload
    uploadedBy: { type: Schema.Types.ObjectId, ref: "User" }, // Ai tải lên (nếu có hệ user)
  },
  { _id: false } // không cần id riêng vì chỉ là subdocument
);

const ChildSchema = new Schema(
  {
    name: String,
    birthDate: { type: Date }, // ✅
    gender: String,
    school: String,
    note: String,
  },
  { _id: false }
);

const ParentsSchema = new Schema(
  {
    fatherName: String,
    fatherBirthYear: Number,
    fatherStatus: String,
    motherName: String,
    motherBirthYear: Number,
    motherStatus: String,
    address: String,
    phone: String,
  },
  { _id: false }
);

const FamilySchema = new Schema(
  {
    maritalStatus: {
      type: String,
      enum: ["Độc thân", "Kết hôn", "Khác"],
    },
    marriageDate: { type: Date }, // ✅
    spouseName: String,
    spouseBirthYear: Number,
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
            birthYear: Number,
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

    attendance: AttendanceSchema,
    documents: { type: [DocumentItemSchema], default: [] },

    family: FamilySchema,

    notes: String,
  },
  { timestamps: true }
);
SoldierSchema.index({
  fullName: "text",
  "identityDocs.policeCode": 1,
  unitPath: 1,
  updatedAt: -1,
});
export const Soldier = mongoose.model("Soldier", SoldierSchema);
