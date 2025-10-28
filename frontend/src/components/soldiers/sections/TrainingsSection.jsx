import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";

export default function TrainingsSection({ items = [] }) {
  return (
    <SectionCard
      title="Đào tạo & Huấn luyện"
      action={<Chip variant="outlined" size="small" label={items.length ? `${items.length} khóa` : "Chưa có dữ liệu"} />}
    >
      <Typography color="text.secondary">
        (Khung trống) — Sẽ hiển thị danh sách <code>trainings</code> từ API.
      </Typography>
    </SectionCard>
  );
}
