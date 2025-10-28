// src/mocks/rewards.mock.js

export const AWARD_TYPES = [
  { value: "commendation", label: "Giấy khen" },
  { value: "certificate", label: "Bằng khen" },
  { value: "medal", label: "Huân/Huy chương" },
  { value: "bonus", label: "Thưởng" },
  { value: "other", label: "Khác" },
];

export const DISCIPLINE_TYPES = [
  { value: "reprimand", label: "Khiển trách" },
  { value: "warning", label: "Cảnh cáo" },
  { value: "salary_cut", label: "Cắt thi đua/Lương" },
  { value: "demotion", label: "Hạ bậc/Kỷ luật nặng" },
  { value: "other", label: "Khác" },
];

export const MOCK_AWARDS = [
  {
    _id: "aw_001",
    soldierId: "68fb8438067657a0a1e2e328",
    type: "certificate",
    title: "Bằng khen đột xuất",
    reason: "Thành tích xuất sắc trong chuyên án 09/2019",
    issuer: "Công an Tỉnh",
    decisionNo: "112/QĐ-CAT",
    decisionDate: "2019-10-15T00:00:00.000Z",
    note: "",
  },
  {
    _id: "aw_002",
    soldierId: "68fb8438067657a0a1e2e328",
    type: "bonus",
    title: "Thưởng hoàn thành nhiệm vụ cao điểm Tết",
    reason: "Hoàn thành xuất sắc nhiệm vụ bảo đảm ANTT dịp Tết",
    issuer: "PK02",
    decisionNo: "07/QĐ-PK02",
    decisionDate: "2021-02-20T00:00:00.000Z",
    note: "Chi thưởng theo quy định.",
  },
  {
    _id: "aw_003",
    soldierId: "68fb8438067657a0a1e2e328",
    type: "commendation",
    title: "Giấy khen quý II/2024",
    reason: "Đạt danh hiệu Chiến sĩ tiên tiến",
    issuer: "PK02",
    decisionNo: "45/QĐ-PK02",
    decisionDate: "2024-06-30T00:00:00.000Z",
    note: "",
  },
];

export const MOCK_DISCIPLINES = [
  {
    _id: "dl_001",
    soldierId: "68fb8438067657a0a1e2e328",
    type: "reprimand",
    title: "Khiển trách",
    violation: "Đi muộn buổi giao ban",
    issuer: "Đội trưởng",
    decisionNo: "03/QĐ-ĐT",
    decisionDate: "2020-08-05T00:00:00.000Z",
    note: "Nhắc nhở rút kinh nghiệm.",
  },
  {
    _id: "dl_002",
    soldierId: "68fb8438067657a0a1e2e328",
    type: "warning",
    title: "Cảnh cáo",
    violation: "Thiếu sót báo cáo ca trực",
    issuer: "PK02",
    decisionNo: "19/QĐ-PK02",
    decisionDate: "2023-04-10T00:00:00.000Z",
    note: "",
  },
];
