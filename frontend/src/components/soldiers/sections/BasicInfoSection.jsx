import { Chip, Typography, Box, CircularProgress } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import InfoGrid from "@/components/common/InfoGrid";

function fmtDate(d) {
  if (!d) return "";
  const dt = typeof d === "string" || typeof d === "number" ? new Date(d) : d;
  // Nếu chuỗi ISO hợp lệ:
  if (!isNaN(dt.getTime())) {
    return dt.toLocaleDateString("vi-VN");
  }
  return "";
}

export default function BasicInfoSection({ data = {}, loading, err }) {
  if (loading) {
    return (
      <SectionCard title="Thông tin cá nhân">
        <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
          <CircularProgress size={28} />
        </Box>
      </SectionCard>
    );
  }

  if (err) {
    return (
      <SectionCard title="Thông tin cá nhân">
        <Typography color="error">
          Không thể tải dữ liệu: {String(err)}
        </Typography>
      </SectionCard>
    );
  }

  // 🔧 Chỉ giữ các giá trị đã được format thành primitive (string/number)
  const flat = {
    "Họ và tên": data.fullName || "",
    "Giới tính": data.gender || "",
    "Ngày sinh": fmtDate(data.birthDate),
    "Nơi sinh": data.birthPlace || "",
    "Quê quán": data.hometown || "",
    "Địa chỉ thường trú": data.permanentAddress || "",
    "Địa chỉ hiện tại": data.currentAddress || "",
    "Số CCCD": data.identity?.cccd || "",
    "Ngày cấp CCCD": fmtDate(data.identity?.cccdIssuedAt),
    "Nơi cấp CCCD": data.identity?.cccdIssuedPlace || "",
    "Nhóm máu": data.bloodType || "",
    "Tôn giáo": data.religion || "",
    "Tình trạng hôn nhân": data.maritalStatus || "",
    Email: data.email || "",
    "Số điện thoại": data.phone || "",
  };

  // 🧩 Nếu InfoGrid của bạn nhận OBJECT (map nhãn->giá trị), giữ nguyên `flat`.
  // 🧩 Nếu InfoGrid của bạn nhận ARRAY [{label, value}], đổi như sau:
  // const flatArray = Object.entries(flat).map(([label, value]) => ({ label, value }));

  return (
    <SectionCard title="Thông tin cá nhân">
      {/* Nếu InfoGrid nhận object: */}
      <InfoGrid data={flat} />

      {/* Nếu InfoGrid cần array, dùng dòng dưới và sửa dòng trên lại thành <InfoGrid data={flatArray} /> */}
      {/* <InfoGrid data={flatArray} /> */}

      {data.notes && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary">
            Ghi chú
          </Typography>
          <Chip
            label={data.notes}
            color="primary"
            variant="outlined"
            sx={{ mt: 0.5 }}
          />
        </Box>
      )}
    </SectionCard>
  );
}
