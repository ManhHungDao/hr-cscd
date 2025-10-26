# HR-CSCD (Quản lý nhân sự Phòng Cảnh sát Cơ động)

Monorepo gồm **backend (Node.js/Express/MongoDB)** và **frontend (React + Vite + MUI)**.

## Khởi chạy nhanh (Local)

### 1) MongoDB

- Cài MongoDB Community hoặc dùng Docker `mongo:6`.
- Mặc định URI: `mongodb://127.0.0.1:27017/hr_cscd` (đặt trong `backend/.env`).

### 2) Backend

```bash
cd backend
npm i
npm run dev
```

### 3) Frontend

```bash
cd frontend
npm i
npm run dev
```

> Nếu gặp lỗi `MongooseServerSelectionError: getaddrinfo ENOTFOUND mongo` hãy dùng `127.0.0.1` trong `MONGO_URI` hoặc chạy qua Docker Compose nơi service name `mongo` mới khả dụng trong mạng Docker.

import PersonalInfoSection from "@/components/common/PersonalInfoSection.jsx";

const relative = {
name: "Nguyễn Thị A",
gender: "Nữ",
birthDate: "1992-05-01",
currentAddress: { line: "12 Lê Lợi", ward: "P.Bến Thành", province: "TP.HCM" },
phones: [{ label: "Di động", number: "0909 123 456" }],
emails: [{ label: "Cá nhân", address: "abc@example.com" }],
note: "Nhân viên kế toán - Công ty XYZ",
};

export default function RelativeCard() {
return <PersonalInfoSection title="Người thân" person={relative} />;
}
