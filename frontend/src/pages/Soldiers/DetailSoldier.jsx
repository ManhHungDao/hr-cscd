import { Stack, Typography, CircularProgress } from "@mui/material";
import useFetch from "@/hooks/useFetch";
import PersonalInfoSection from "@/components/common/PersonalInfoSection.jsx";
import { DocumentsList, FamilySection } from "@/components/soldiers/parts";
import EducationSkillsSection from "@/components/soldiers/parts/EducationSkillsSection";
import OrganizationSection from "@/components/soldiers/parts/OrganizationSection";

export default function DetailSoldier({
  soldierId,
  apiBase = "/api/soldiers",
}) {
  const { data, loading, error } = useFetch(
    soldierProp ? null : soldierId ? `${apiBase}/${soldierId}` : null
  );
  const soldier = soldierProp || data;

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

  return (
    <Stack spacing={2.5}>
      {/* 1) Thông tin cá nhân */}
      <PersonalInfoSection person={personForHeader} />
      {/* 2) -Tổ chức -  Cấp bậc - Chức vụ hiện tại */}
      <OrganizationSection soldier={soldier} />
      {/* 3) Học vấn & Kỹ năng */}
      <EducationSkillsSection soldier={soldier} />
      {/* 4) Quá trình công tác - Thăng cấp & Bậc lương */}
      <ServiceWorkerSection soldier={soldier} />

      {/* 8) Khen thưởng & Kỷ luật */}

      {/* 9) Gia đình */}
      <FamilySection family={soldier?.family} soldier={soldier} />

      {/* 10) Tài liệu */}
      <DocumentsList docs={soldier?.documents || []} />

      {/* 11) Ghi chú */}
      <NotesSection soldier={soldier} />
    </Stack>
  );
}
