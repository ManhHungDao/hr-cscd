import { Chip, Stack, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";

export default function AwardsDisciplineSection({ awards = [], disciplines = [] }) {
  return (
    <SectionCard
      title="Khen thưởng & Kỷ luật"
      action={
        <Stack direction="row" spacing={1}>
          <Chip variant="outlined" size="small" label={awards.length ? `${awards.length} khen thưởng` : "0 khen thưởng"} />
          <Chip variant="outlined" size="small" label={disciplines.length ? `${disciplines.length} kỷ luật` : "0 kỷ luật"} />
        </Stack>
      }
    >
      <Typography color="text.secondary">
        (Khung trống) — Sẽ hiển thị bảng <code>awards</code>/<code>disciplines</code>.
      </Typography>
    </SectionCard>
  );
}
