import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";

export default function AttendanceSection({ data }) {
  return (
    <SectionCard title="Lịch sử Chấm công" action={<Chip variant="outlined" size="small" label={data ? "Có dữ liệu" : "Chưa có dữ liệu"} />}>
      <Typography color="text.secondary">
        (Khung trống) — Sẽ hiển thị bảng chấm công từ <code>attendance</code>.
      </Typography>
    </SectionCard>
  );
}
