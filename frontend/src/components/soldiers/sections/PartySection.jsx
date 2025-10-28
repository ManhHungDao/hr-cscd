import { Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import InfoGrid from "@/components/common/InfoGrid";

export default function PartySection({ data, err }) {
  return (
    <SectionCard title="Thông tin Đảng/Đoàn">
      {err ? <Typography color="error">Không thể tải dữ liệu.</Typography> : <InfoGrid data={data} />}
    </SectionCard>
  );
}
