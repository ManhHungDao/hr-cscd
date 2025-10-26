import { Grid } from "@mui/material";
import SectionCard from "@/components/common/SectionCard.jsx";
import { fmtDate, safe } from "@/utils/format";
import TimelineList from "@/components/common/TimelineList.jsx";
export default function OrganizationSection({ soldier }) {
  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Khen thưởng">
            <TimelineList
              items={soldier?.awards || []}
              fields={[
                (it) => fmtDate(it.date),
                (it) => `${safe(it.title)}`,
                (it) => joinNonEmpty([it.decisionNo, it.note], " • "),
              ]}
            />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Kỷ luật">
            <TimelineList
              items={soldier?.disciplines || []}
              fields={[
                (it) => fmtDate(it.date),
                (it) => `${safe(it.form)} — ${safe(it.reason)}`,
                (it) => joinNonEmpty([it.decisionNo, it.note], " • "),
              ]}
            />
          </SectionCard>
        </Grid>
      </Grid>
    </>
  );
}
