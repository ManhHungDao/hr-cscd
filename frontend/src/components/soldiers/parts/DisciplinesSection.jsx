import { Grid } from "@mui/material";
import TimelineSection from "./TimelineSection.jsx";
import { fmtDate, joinNonEmpty, safe } from "@/utils/format";

export default function DisciplinesSection({ soldier }) {
  return (
    <Grid item xs={12} md={6}>
      <TimelineSection
        title="Kỷ luật"
        items={soldier?.disciplines}
        fields={[
          (it) => fmtDate(it.date),
          (it) => `${safe(it.form)} — ${safe(it.reason)}`,
          (it) => joinNonEmpty([it.decisionNo, it.note], " • "),
        ]}
      />
    </Grid>
  );
}
