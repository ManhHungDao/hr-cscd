import SectionCard from "@/components/common/SectionCard.jsx";
import { Typography } from "@mui/material";

export default function NotesSection({ notes }) {
  if (!notes) return null;
  return (
    <SectionCard title="Ghi chú">
      <Typography variant="body1">{notes}</Typography>
    </SectionCard>
  );
}
