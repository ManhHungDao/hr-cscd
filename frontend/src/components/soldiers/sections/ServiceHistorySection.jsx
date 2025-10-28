import { Chip, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard";

export default function ServiceHistorySection({ items = [] }) {
  return (
    <SectionCard
      title="Quá trình công tác"
      action={<Chip variant="outlined" size="small" label={items.length ? `${items.length} mục` : "Chưa có dữ liệu"} />}
    >
      <Typography color="text.secondary">
        (Khung trống) — Sẽ hiển thị bảng timeline từ API <code>serviceHistory</code>.
      </Typography>
    </SectionCard>
  );
}
