require("dotenv").config();
const { connectDB } = require("./db");
const Soldier = require("./models/soldier");

(async () => {
  try {
    await connectDB(process.env.MONGODB_URI);

    await Soldier.deleteMany({ fullName: /LÊ THANH BÌNH/i });

    const doc = await Soldier.create({
      avatar: "https://i.pravatar.cc/120?img=35",
      fullName: "LÊ THANH BÌNH",
      current: {
        rank: "Thượng úy",
        position: "Tiểu đội trưởng",
        from: "2023-06",
      },
      unitPath: "Trung đội 1, Đại đội C1, Tiểu đoàn 6",

      identityDocs: {
        policeCode: "A213-B456",
        cccd: "012345678901",
        cccdIssuedAt: "2016-05-20",
        cccdIssuedPlace: "Hà Nội",
      },

      demographics: {
        birthDate: "1990-03-15",
        birthPlace: "Hà Nội",
        hometown: "Nam Định",
        permanentAddress: "Số 123, P. Trần Hưng Đạo, Q. Hoàn Kiếm, Hà Nội",
        currentAddress: { district: "Hoàn Kiếm", city: "Hà Nội" },
        bloodType: "O",
        religion: "Không",
        maritalStatus: "married",
        childrenCount: 1,
      },

      contact: {
        phones: [{ label: "Cá nhân", number: "0912345778" }],
        emails: [{ label: "CAND", address: "binhlt@cand.gov.vn" }],
        emergencyContact: {
          name: "Nguyễn A",
          relation: "Vợ",
          phone: "09xxxxxxx",
        },
      },

      party: { joinedPoliceAt: "2012-09-15", joinedPartyAt: "2015-03-15" },

      education: {
        degree: "Đại học",
        major: "Nghiệp vụ CAND",
        mode: "Chính quy",
        grade: "Giỏi",
        graduationYear: 2012,
        institution: "HV An ninh Nhân dân",
        secondDegree: { major: "Luật", institution: "ĐH Luật HN", year: 2022 },
      },

      skills: {
        politicsLevel: "Cao cấp",
        itLevel: "Ứng dụng CNTT cơ bản",
        language: [{ name: "Anh", level: "B1" }],
        qpanLevel: "Hoàn thành",
        drivingLicense: "B1",
      },

      trainings: [
        {
          name: "Tập huấn bắn đạn thật",
          time: "2024-07",
          place: "Trường bắn T78",
          score: "Khá",
        },
        {
          name: "Bồi dưỡng chức danh Chỉ huy trung đội",
          time: "2023-05",
          place: "HV CAND",
        },
      ],

      serviceHistory: [
        {
          from: "2018-01",
          to: "2021-12",
          unitPath: "Đại đội B2",
          position: "Chiến sĩ",
        },
        {
          from: "2022-01",
          unitPath: "Đại đội C1",
          position: "Tiểu đội trưởng",
          decisionNo: "QĐ-15/C1/2022",
        },
      ],
      promotions: [
        {
          date: "2020-06-15",
          fromRank: "Trung úy",
          toRank: "Thượng úy",
          decisionNo: "QĐ-PL01/2020",
        },
      ],
      salarySteps: [
        { date: "2023-01-01", coefficient: 4.4, decisionNo: "QĐ-LS-33/2022" },
      ],

      awards: [
        {
          date: "2023-12-20",
          title: "Chiến sĩ thi đua cơ sở",
          decisionNo: "QĐ-KT-88/2023",
        },
      ],
      disciplines: [],

      attendance: {
        period: { from: "2025-01-01", to: "2025-12-31" },
        source: "attendance_records",
      },

      documents: [
        {
          name: "So-yeu-ly-lich.pdf",
          type: "pdf",
          url: "/files/so-yeu.pdf",
          uploadedAt: new Date().toISOString(),
          securityLevel: "internal",
        },
      ],

      family: {
        maritalStatus: "married",
        marriageDate: "2018-10-12",
        spouseName: "Nguyễn Thị B",
        spouseBirthYear: 1991,
        spouseOccupation: "Giáo viên",
        spouseWorkplace: "THCS A, Q7",
        spousePhone: "09xxxxxxx",
        children: [
          {
            name: "Nguyễn C",
            birthDate: "2020-05-10",
            gender: "nam",
            school: "MN Hoa Sen",
          },
        ],
        parents: {
          fatherName: "Lê D",
          fatherBirthYear: 1960,
          fatherStatus: "còn",
          motherName: "Trần E",
          motherBirthYear: 1962,
          motherStatus: "còn",
          address: "Nam Định",
          phone: "02xxxxxx",
        },
        householdRegistration: "Thôn X, xã Y, huyện Z, Nam Định",
        householdMembers: [
          { name: "Lê D", relation: "Cha", birthYear: 1960 },
          { name: "Trần E", relation: "Mẹ", birthYear: 1962 },
        ],
        nextOfKin: { name: "Lê F", relation: "Anh trai", phone: "09xxxxxxx" },
        familyPolicyStatus: "Không",
        familyNotes: "Hậu phương ổn định",
      },

      notes: "Hồ sơ sạch.",
    });

    console.log("🌱 Seeded:", doc.fullName, doc._id.toString());
    process.exit(0);
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
})();
