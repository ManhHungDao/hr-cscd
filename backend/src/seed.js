// src/seed.js
import mongoose from "mongoose";
import Soldier from "./models/soldier.js"; // ✅ import default từ ESM model

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/hr_cscd";

// Helpers
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
const dateFromYMD = (y, m, d = 1) => new Date(Date.UTC(y, m - 1, d));

const RANKS = [
  "Binh nhất",
  "Binh nhì",
  "Hạ sĩ",
  "Trung sĩ",
  "Thượng sĩ",
  "Thiếu úy",
  "Trung úy",
  "Thượng úy",
  "Đại úy",
  "Thiếu tá",
  "Trung tá",
  "Thượng tá",
  "Đại tá",
  "Thiếu tướng",
  "Trung tướng",
  "Thượng tướng",
  "Đại tướng",
  "Không xác định",
];
const MARITAL = ["Độc thân", "Kết hôn", "Khác"];
const FAMILY_MARITAL = ["Độc thân", "Kết hôn", "Khác"];
const BLOOD = ["A", "B", "AB", "O", "Unknown"];

const nameVN = () => {
  const last = [
    "Nguyễn",
    "Trần",
    "Lê",
    "Phạm",
    "Hoàng",
    "Võ",
    "Vũ",
    "Đặng",
    "Bùi",
    "Đỗ",
  ];
  const mid = [
    "Văn",
    "Hữu",
    "Thanh",
    "Ngọc",
    "Thị",
    "Đình",
    "Minh",
    "Tuấn",
    "Quang",
    "Thảo",
  ];
  const first = [
    "An",
    "Bình",
    "Cường",
    "Dũng",
    "Hưng",
    "Long",
    "Thảo",
    "Trang",
    "Tú",
    "Vy",
  ];
  return `${pick(last)} ${pick(mid)} ${pick(first)}`;
};
const phone = () => `0${randInt(3, 9)}${randInt(10000000, 99999999)}`;

const address = () => ({
  line: `${randInt(1, 199)} Đường ${pick([
    "Lê Lợi",
    "Trần Phú",
    "Nguyễn Huệ",
    "Hai Bà Trưng",
  ])}`,
  ward: `Phường ${randInt(1, 15)}`,
  province: pick(["TP.HCM", "Hà Nội", "Đà Nẵng", "Cần Thơ", "Bình Dương"]),
});

const docMeta = (id) => {
  const stored = `${Date.now()}_${randInt(100, 999)}.pdf`;
  return {
    name: "Báo cáo công tác tháng",
    note: "Chỉ dùng nội bộ",
    type: "pdf",
    tags: ["báo cáo", "PK02"],
    originalName: "baocao.pdf",
    storedName: stored,
    extension: ".pdf",
    mimeType: "application/pdf",
    size: randInt(150000, 4500000),
    storageType: "local",
    baseDir: "uploads",
    relativePath: `soldiers/${id}/documents/${stored}`,
    url: `/api/soldiers/${id}/documents/download/${stored}`,
    uploadedAt: new Date(),
  };
};

const child = () => ({
  name: nameVN(),
  birthDate: dateFromYMD(randInt(2013, 2023), randInt(1, 12), randInt(1, 28)),
  gender: pick(["nam", "nữ", "khác"]),
  school: pick(["THCS A", "THPT B", "Mầm non C", "Tiểu học D"]),
  note: "",
});

const buildSoldier = (_id) => {
  const fullName = nameVN();
  const rank = pick(RANKS);

  return {
    _id,
    avatar: "",
    fullName,
    current: {
      rank,
      position: pick([
        "Chiến sĩ",
        "Tiểu đội phó",
        "Tiểu đội trưởng",
        "Trung đội trưởng",
      ]),
      from: dateFromYMD(randInt(2019, 2024), randInt(1, 12), 1),
    },
    unitPath: `PK02/${pick([
      "Đội 1",
      "Đội 2",
      "Đội 3",
      "Đội Tuần tra",
      "Đội Cơ động",
    ])}/${pick(["Tiểu đội A", "Tiểu đội B", "Tiểu đội C"])}`,

    identityDocs: {
      policeCode: `CS-${randInt(100000, 999999)}`,
      cccd: `${randInt(100000000000, 999999999999)}`,
      cccdIssuedAt: dateFromYMD(
        randInt(2010, 2020),
        randInt(1, 12),
        randInt(1, 28)
      ),
      cccdIssuedPlace: pick(["TP.HCM", "Hà Nội", "Đà Nẵng"]),
    },

    party: {
      joinedPoliceAt: dateFromYMD(
        randInt(2015, 2020),
        randInt(1, 12),
        randInt(1, 28)
      ),
      joinedPartyAt:
        Math.random() < 0.5
          ? dateFromYMD(randInt(2018, 2024), randInt(1, 12), randInt(1, 28))
          : undefined,
    },

    demographics: {
      birthDate: dateFromYMD(
        randInt(1988, 2000),
        randInt(1, 12),
        randInt(1, 28)
      ),
      birthPlace: pick([
        "TP.HCM",
        "Hà Nội",
        "Nam Định",
        "Thanh Hóa",
        "Quảng Nam",
      ]),
      hometown: pick([
        "Thái Bình",
        "Nghệ An",
        "Hà Tĩnh",
        "Bắc Ninh",
        "Bình Định",
      ]),
      permanentAddress: "Sổ hộ khẩu ABC, Huyện XYZ",
      currentAddress: address(),
      bloodType: pick(BLOOD),
      religion: pick(["Không", "Phật giáo", "Thiên chúa giáo", "Khác"]),
      maritalStatus: pick(MARITAL),
      childrenCount: randInt(0, 3),
    },

    contact: {
      phones: [
        { label: "Cá nhân", number: phone() },
        { label: "Cơ quan", number: phone() },
      ],
      emails: [
        {
          label: "Cơ quan",
          address: `${fullName
            .replace(/\s/g, ".")
            .toLowerCase()}@police.gov.vn`,
        },
        {
          label: "Cá nhân",
          address: `${fullName.replace(/\s/g, ".").toLowerCase()}@gmail.com`,
        },
      ],
      emergencyContact: {
        name: nameVN(),
        relation: "Người thân",
        phone: phone(),
      },
    },

    education: {
      degree: pick(["Cử nhân", "Thạc sĩ"]),
      major: pick(["Cảnh sát cơ động", "Luật", "CNTT"]),
      mode: "Chính quy",
      grade: pick(["Giỏi", "Khá", "Trung bình"]),
      graduationYear: randInt(2010, 2020),
      institution: pick(["Học viện Cảnh sát ND", "ĐH Kỹ thuật - Hậu cần CAND"]),
    },

    skills: {
      politicsLevel: pick(["Sơ cấp", "Trung cấp", "Cao cấp"]),
      itLevel: pick(["A", "B", "C"]),
      language: [{ name: "Anh", level: "B1" }],
      qpanLevel: "Tốt",
      drivingLicense: pick(["A1", "B2", "C"]),
    },

    trainings: [
      {
        name: "Huấn luyện điều lệnh",
        time: dateFromYMD(randInt(2019, 2024), randInt(1, 12), randInt(1, 28)),
        place: "Trung tâm huấn luyện PK02",
        certNo: `HL-${randInt(1000, 9999)}`,
        score: pick(["Giỏi", "Khá"]),
      },
    ],

    serviceHistory: [
      {
        from: dateFromYMD(2020, 1, 1),
        to: new Date(),
        unitPath: "PK02/Đội 2",
        position: "Chiến sĩ",
        decisionNo: "QD-123",
      },
    ],

    promotions: [
      {
        date: dateFromYMD(2023, 5, 12),
        fromRank: "Trung úy",
        toRank: "Thượng úy",
        decisionNo: "PC-456",
      },
    ],

    salarySteps: [
      {
        date: dateFromYMD(2024, 3, 15),
        coefficient: 3.4,
        decisionNo: "LS-678",
      },
    ],

    awards: [
      {
        date: dateFromYMD(2024, 1, 10),
        title: "Giấy khen PK02",
        decisionNo: "KT-789",
      },
    ],

    disciplines: [],

    attendance: {
      period: { from: dateFromYMD(2025, 1, 1), to: dateFromYMD(2025, 2, 1) },
      source: "Hệ thống A",
      note: "Đủ công",
    },

    documents: [docMeta(_id.toString())],

    family: {
      maritalStatus: pick(FAMILY_MARITAL),
      marriageDate: new Date("2018-10-12"),
      spouseName: nameVN(),
      spouseBirthYear: 1992,
      spouseOccupation: "Giáo viên",
      spouseWorkplace: "Trường Tiểu học B",
      spousePhone: phone(),
      children: Array.from({ length: randInt(0, 2) }, child),
      parents: {
        fatherName: nameVN(),
        fatherBirthYear: 1965,
        fatherStatus: "còn",
        motherName: nameVN(),
        motherBirthYear: 1968,
        motherStatus: "còn",
        address: "Hà Nội",
        phone: phone(),
      },
      householdRegistration: "Sổ hộ khẩu số 67890",
      householdMembers: [
        { name: nameVN(), relation: "Anh", birthYear: 1990 },
        { name: nameVN(), relation: "Em", birthYear: 1998 },
      ],
      nextOfKin: { name: nameVN(), relation: "Anh", phone: phone() },
      familyPolicyStatus: pick(["Không", "Gia đình có công"]),
      familyNotes: "",
    },

    notes: "Hồ sơ được seed tự động",
  };
};

async function main() {
  console.log("🔌 Kết nối MongoDB...");
  await mongoose.connect(MONGODB_URI);
  console.log("✅ Đã kết nối:", MONGODB_URI);

  await Soldier.deleteMany({});
  console.log("🧹 Đã xóa dữ liệu cũ");

  const docs = [];
  for (let i = 0; i < 5; i++) {
    docs.push(buildSoldier(new mongoose.Types.ObjectId()));
  }
  await Soldier.insertMany(docs);
  console.log(`🌱 Đã seed ${docs.length} hồ sơ`);

  await mongoose.disconnect();
  console.log("✅ Hoàn tất");
}

main().catch((err) => {
  console.error("❌ Lỗi seed:", err);
  mongoose.disconnect();
});
