// src/mock/dutyMock.js
import { makeSlots } from "../../../utils/time";

export const dateForView = "2025-10-23";

// Chỉ huy trực NGÀY (toàn đơn vị)
export const dayCommander = {
  rank: "Thiếu tá",
  fullname: "Phạm Quốc Bảo",
  phone: "+84 912 888 777",
};

// soldiers mẫu
const pool = [
  {
    id: "s001",
    name: "Nguyễn Văn A",
    badge: "CB-001",
    phone: "+84 91 111 0001",
  },
  { id: "s002", name: "Trần Thị B", badge: "CB-002", phone: "+84 91 111 0002" },
  { id: "s003", name: "Lê Văn C", badge: "CB-003", phone: "+84 91 111 0003" },
  { id: "s004", name: "Phạm Thị D", badge: "CB-004", phone: "+84 91 111 0004" },
  { id: "s005", name: "Võ Văn E", badge: "CB-005", phone: "+84 91 111 0005" },
  { id: "s006", name: "Bùi Thị F", badge: "CB-006", phone: "+84 91 111 0006" },
  { id: "s007", name: "Đặng Văn G", badge: "CB-007", phone: "+84 91 111 0007" },
  {
    id: "s008",
    name: "Hoàng Thị H",
    badge: "CB-008",
    phone: "+84 91 111 0008",
  },
];

// Helper tạo các cặp 2 người xoay theo từng slot 2 tiếng
function pairRotation(soldiers, teamSize = 2) {
  const res = [];
  let i = 0;
  while (i < soldiers.length) {
    const group = soldiers.slice(i, i + teamSize);
    if (group.length < teamSize) {
      // nếu thiếu người, lấy từ đầu để đủ teamSize
      group.push(...soldiers.slice(0, teamSize - group.length));
    }
    res.push(group);
    i += teamSize;
  }
  return res;
}

// Gán người vào từng slot theo vòng tròn (round-robin)
function assignSoldiersToSlots(slots, soldiers, teamSize = 2) {
  const teams = pairRotation(soldiers, teamSize);
  const out = [];
  for (let idx = 0; idx < slots.length; idx++) {
    const team = teams[idx % teams.length];
    out.push({ ...slots[idx], soldiers: team });
  }
  return out;
}

// Danh sách mục tiêu trong ngày
export const targets = [
  {
    id: "tgt-1",
    name: "Mục tiêu A — Trụ sở chính",
    location: "Số 1, Đường A",
    commander: {
      rank: "Đại úy",
      position: "Chỉ huy mục tiêu",
      fullname: "Nguyễn Hữu Minh",
      phone: "+84 983 222 333",
    },
    // Ví dụ: 1 ca (00:00–24:00), slot 2 giờ, mỗi slot có 2 chiến sĩ
    dayPlan: {
      from: "00:00",
      to: "24:00",
      slotMinutes: 120,
      teamSize: 2,
      soldiers: pool.slice(0, 4), // chọn 4 người xoay cặp
    },
  },
  {
    id: "tgt-2",
    name: "Mục tiêu B — Khu công nghiệp X",
    location: "KCN X, Lô B2",
    commander: {
      rank: "Thượng úy",
      position: "Chỉ huy mục tiêu",
      fullname: "Trương Thị Lan",
      phone: "+84 912 900 800",
    },
    // 2 ca: Sáng (06–18) slot 2h, Đêm (18–24) slot 2h + (00–06) slot 2h
    shifts: [
      {
        id: "b-sang",
        label: "Ca ngày",
        from: "06:00",
        to: "18:00",
        slotMinutes: 120,
        teamSize: 2,
        soldiers: pool.slice(2, 8),
      },
      {
        id: "b-dem",
        label: "Ca đêm",
        from: "18:00",
        to: "24:00",
        slotMinutes: 120,
        teamSize: 2,
        soldiers: pool.slice(0, 6),
      },
      {
        id: "b-dem2",
        label: "Ca đêm (tiếp)",
        from: "00:00",
        to: "06:00",
        slotMinutes: 120,
        teamSize: 2,
        soldiers: pool.slice(0, 6),
      },
    ],
  },
  {
    id: "tgt-3",
    name: "Mục tiêu C — Văn phòng lưu động",
    location: "Điểm B",
    commander: {
      rank: "Thiếu tá",
      position: "Chỉ huy mục tiêu",
      fullname: "Phan Văn Q",
      phone: "+84 912 700 500",
    },
    dayPlan: {
      from: "08:00",
      to: "22:00",
      slotMinutes: 120,
      teamSize: 2,
      soldiers: pool.slice(4, 8),
    },
  },
];

// Expand để UI dùng trực tiếp
export function buildTargetSchedule(target) {
  // Nếu có shifts cụ thể: expand từng shift
  if (target.shifts && target.shifts.length) {
    return target.shifts.map((s) => {
      const slots = makeSlots(s.from, s.to, s.slotMinutes);
      const withPeople = assignSoldiersToSlots(slots, s.soldiers, s.teamSize);
      return { ...s, slots: withPeople };
    });
  }
  // Nếu chỉ có dayPlan: coi như 1 ca lớn
  if (target.dayPlan) {
    const s = target.dayPlan;
    const slots = makeSlots(s.from, s.to, s.slotMinutes);
    const withPeople = assignSoldiersToSlots(slots, s.soldiers, s.teamSize);
    return [
      {
        id: `${target.id}-day`,
        label: "Ca toàn ngày",
        from: s.from,
        to: s.to,
        slotMinutes: s.slotMinutes,
        teamSize: s.teamSize,
        slots: withPeople,
      },
    ];
  }
  return [];
}
