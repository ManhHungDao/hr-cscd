// mockData.js
// Dữ liệu ảo cho trang lịch trực (mẫu cho 1 ngày)

export const dateForView = "2025-10-23"; // yyyy-mm-dd

export const dutyData = [
  {
    id: "target-1",
    name: "Mục tiêu A - Trụ sở chính",
    location: "Số 1, Đường A",
    commander: {
      rank: "Thượng úy",
      position: "Chỉ huy mục tiêu",
      fullname: "Nguyễn Văn A",
      phone: "+84 912 345 678",
    },
    shifts: [
      {
        id: "t1-s1",
        label: "Ca sáng",
        start: "06:00",
        end: "12:00",
        soldiers: [
          {
            id: "s001",
            name: "Lê Văn B",
            badge: "CB-001",
            phone: "+84 91 111 0001",
          },
          {
            id: "s002",
            name: "Trần Thị C",
            badge: "CB-002",
            phone: "+84 91 111 0002",
          },
        ],
      },
      {
        id: "t1-s2",
        label: "Ca chiều",
        start: "12:00",
        end: "18:00",
        soldiers: [
          {
            id: "s003",
            name: "Phạm Văn D",
            badge: "CB-003",
            phone: "+84 91 111 0003",
          },
        ],
      },
      {
        id: "t1-s3",
        label: "Ca đêm",
        start: "18:00",
        end: "06:00",
        soldiers: [
          {
            id: "s004",
            name: "Hoàng Thị E",
            badge: "CB-004",
            phone: "+84 91 111 0004",
          },
          {
            id: "s005",
            name: "Võ Văn F",
            badge: "CB-005",
            phone: "+84 91 111 0005",
          },
          {
            id: "s006",
            name: "Bùi Văn G",
            badge: "CB-006",
            phone: "+84 91 111 0006",
          },
        ],
      },
    ],
  },

  {
    id: "target-2",
    name: "Mục tiêu B - Khu công nghiệp",
    location: "KCN X",
    commander: {
      rank: "Đại úy",
      position: "Chỉ huy mục tiêu",
      fullname: "Trương Thị H",
      phone: "+84 983 222 333",
    },
    shifts: [
      {
        id: "t2-s1",
        label: "Ca sáng",
        start: "07:00",
        end: "13:00",
        soldiers: [
          {
            id: "s010",
            name: "Ngô Văn K",
            badge: "CB-010",
            phone: "+84 90 010 1010",
          },
        ],
      },
      {
        id: "t2-s2",
        label: "Ca chiều",
        start: "13:00",
        end: "19:00",
        soldiers: [
          {
            id: "s011",
            name: "Lâm Thị L",
            badge: "CB-011",
            phone: "+84 90 010 1011",
          },
          {
            id: "s012",
            name: "Đặng Văn M",
            badge: "CB-012",
            phone: "+84 90 010 1012",
          },
        ],
      },
    ],
  },

  {
    id: "target-3",
    name: "Mục tiêu C - Văn phòng lưu động",
    location: "Điểm B",
    commander: {
      rank: "Thiếu tá",
      position: "Chỉ huy mục tiêu",
      fullname: "Phan Văn Q",
      phone: "+84 912 900 800",
    },
    shifts: [
      {
        id: "t3-s1",
        label: "Ca toàn ngày",
        start: "00:00",
        end: "24:00",
        soldiers: [
          {
            id: "s020",
            name: "Mai Thị R",
            badge: "CB-020",
            phone: "+84 94 020 2020",
          },
        ],
      },
    ],
  },
];
