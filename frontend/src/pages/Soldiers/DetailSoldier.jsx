import { Stack, Typography, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom"; // 👈 import hook lấy id từ URL
import useFetch from "@/hooks/useFetch";
import PersonalInfoSection from "@/components/common/PersonalInfoSection.jsx";
import {
  DocumentsList,
  FamilySection,
  NotesSection,
  ServiceHistorySection,
  EducationSkillsSection,
  OrganizationSection,
} from "@/components/soldiers/parts";

export default function DetailSoldier({
  soldierId,
  apiBase = "/api/soldiers",
}) {
  // ✅ Lấy id từ URL nếu không truyền props
  const { id: idFromRoute } = useParams();
  const finalId = soldierId || idFromRoute || "68fb8438067657a0a1e2e328";

  // ✅ Gọi API
  const { data, loading, error } = useFetch(`${apiBase}/${finalId}`);
  const soldier = data;

  // ✅ Loading & error handling
  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          Đang tải dữ liệu …
        </Typography>
      </Stack>
    );
  }

  if (error)
    return (
      <Typography color="error">Lỗi tải dữ liệu: {error.message}</Typography>
    );

  if (!soldier) return <Typography>Không có dữ liệu.</Typography>;

  // ✅ Chuẩn bị dữ liệu hiển thị
  const personForHeader = {
    avatar: soldier.avatar,
    fullName: soldier.fullName,
    birthDate: soldier?.demographics?.birthDate,
    birthPlace: soldier?.demographics?.birthPlace,
    hometown: soldier?.demographics?.hometown,
    currentAddress: soldier?.demographics?.currentAddress,
    phones: soldier?.contact?.phones,
    emails: soldier?.contact?.emails,
  };

  // ✅ Render giao diện
  return (
    <Stack spacing={2.5}>
      {/* 1) Thông tin cá nhân */}
      <PersonalInfoSection person={personForHeader} />

      {/* 2) Tổ chức - Cấp bậc - Chức vụ hiện tại */}
      <OrganizationSection soldier={soldier} />

      {/* 3) Học vấn & Kỹ năng */}
      <EducationSkillsSection soldier={soldier} />

      {/* 4) Quá trình công tác - Thăng cấp & Bậc lương */}
      <ServiceHistorySection soldier={soldier} />

      {/* 9) Gia đình */}
      <FamilySection family={soldier?.family} soldier={soldier} />

      {/* 10) Tài liệu */}
      <DocumentsList docs={soldier?.documents || []} />

      {/* 11) Ghi chú */}
      <NotesSection soldier={soldier} />
    </Stack>
  );
}
