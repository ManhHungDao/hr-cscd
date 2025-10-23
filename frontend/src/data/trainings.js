const trainings = [
  {
    id: 101,
    name: "HL-2025-01: Chiến thuật đội hình sân đô thị",
    status: "ongoing", // planned | ongoing | finished
    startAt: "2025-10-22T08:00:00+07:00",
    endAt: "2025-10-24T17:00:00+07:00",
    duration: 6, // số buổi
    location: "Sân huấn luyện Phòng CSCĐ — Q.7",
    content:
      "Ôn tập đội hình cơ bản, di chuyển đội hình trong môi trường đô thị, xử lý tình huống tụ tập đông người.\nThực hành bắn súng ngắn an toàn, kỹ thuật liên lạc đội hình.",
    coaches: [
      { rank: "Đ/c", name: "Nguyễn Văn Minh", role: "Chỉ huy trưởng", phone: "0903 123 456" },
      { rank: "Đ/c", name: "Phạm Thị Hạnh", role: "Huấn luyện viên chiến thuật" },
    ],
    participants: [
      { id: 1, name: "Trần Quốc A" },
      { id: 2, name: "Ngô Văn B" },
      { id: 3, name: "Phạm Văn C" },
      { id: 4, name: "Lê Thị D" },
      { id: 5, name: "Võ Văn E" },
    ],
    modules: ["Đội hình cơ bản", "Kỹ thuật tiếp cận", "Phối hợp liên lạc"],
    checkpoints: [
      { title: "Kiểm tra lý thuyết", when: "2025-10-23T10:00:00+07:00", type: "Trắc nghiệm", note: "40 câu/40 phút" },
      { title: "Diễn tập tình huống", when: "2025-10-24T15:00:00+07:00", type: "Thực hành" },
    ],
  },
  {
    id: 102,
    name: "HL-2025-02: Kỹ năng bắn súng ban đêm",
    status: "planned",
    startAt: "2025-11-05T18:00:00+07:00",
    endAt: "2025-11-06T22:00:00+07:00",
    duration: 2,
    location: "Trường bắn Bình Chánh",
    content: "An toàn súng, bắn mục tiêu có/không ánh sáng hỗ trợ, bài bắn nhóm.",
    coaches: [{ rank: "Đ/c", name: "Đỗ Văn Phúc", role: "Chỉ huy bãi bắn" }],
    participants: Array.from({ length: 18 }).map((_, i) => ({ id: i + 10, name: `Chiến sĩ ${i + 1}` })),
    modules: ["An toàn súng", "Chiến thuật ánh sáng", "Bài bắn nhóm"],
    checkpoints: [{ title: "Bắn kiểm tra", when: "2025-11-06T20:00:00+07:00", type: "Thực hành" }],
  },
  {
    id: 103,
    name: "HL-2025-03: Sơ cấp cứu chiến thuật (TCCC)",
    status: "finished",
    startAt: "2025-09-12T08:00:00+07:00",
    endAt: "2025-09-13T17:00:00+07:00",
    duration: 2,
    location: "Bệnh viện 175 — Q.Gò Vấp",
    content: "Nguyên tắc TCCC, cầm máu, băng bó, vận chuyển nạn nhân. Diễn tập ca giả định.",
    coaches: [
      { rank: "BS", name: "Trần Thu Hằng", role: "Giảng viên" },
      { rank: "Đ/c", name: "Vũ Đức Long", role: "Điều phối" },
    ],
    participants: Array.from({ length: 25 }).map((_, i) => ({ id: i + 100, name: `CBCS ${i + 1}` })),
    modules: ["Tổng quan TCCC", "Cầm máu", "Vận chuyển"],
    checkpoints: [{ title: "Đánh giá cuối khóa", when: "2025-09-13T16:00:00+07:00", type: "Vấn đáp" }],
  },
];

export default trainings;
