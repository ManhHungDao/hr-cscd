import { Chip, Stack } from "@mui/material";
import InfoRow from "@/components/common/InfoRow.jsx";

export default function TagsRow({ title, items = [] }) {
  if (!items?.length) return null;
  return (
    <InfoRow
      label={title}
      value={
        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          {items.map((t, i) => (
            <Chip key={i} size="small" label={t} />
          ))}
        </Stack>
      }
    />
  );
}
