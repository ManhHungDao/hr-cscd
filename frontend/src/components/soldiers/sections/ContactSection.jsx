import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import InfoGrid from "@/components/common/InfoGrid";

export default function ContactSection({ data, err }) {
  return (
    <SectionCard title="Thông tin liên lạc">
      {err ? (
        <Typography color="error">Không thể tải dữ liệu.</Typography>
      ) : (
        <InfoGrid data={data} />
      )}
    </SectionCard>
  );
}
