import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";

export default function DocumentsSection({ items = [] }) {
  return (
    <SectionCard title="Hồ sơ tải lên" action={<Chip variant="outlined" size="small" label={items.length ? `${items.length} tệp` : "Chưa có dữ liệu"} />}>
      <Typography color="text.secondary">
        (Khung trống) — Sẽ hiển thị danh sách file từ <code>documents</code>.
      </Typography>
    </SectionCard>
  );
}
