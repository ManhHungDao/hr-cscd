import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import InfoGrid from "@/components/common/InfoGrid";

export default function BasicInfoSection({ data, loading, err }) {
  return (
    <SectionCard
      title="Sơ yếu lý lịch"
      action={loading ? <Chip size="small" label="Đang tải" /> : <Chip size="small" label="Tải từ API" color="info" />}
    >
      {err ? <Typography color="error">Không thể tải dữ liệu.</Typography> : <InfoGrid data={data} />}
    </SectionCard>
  );
}
