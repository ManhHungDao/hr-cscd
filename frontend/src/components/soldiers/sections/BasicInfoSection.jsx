import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import InfoGrid from "@/components/common/InfoGrid";

export default function BasicInfoSection({ data, loading, err }) {
  return (
    <SectionCard title="Thông tin cá nhân">
      {err ? (
        <Typography color="error">Không thể tải dữ liệu.</Typography>
      ) : (
        <InfoGrid data={data} />
      )}
    </SectionCard>
  );
}
