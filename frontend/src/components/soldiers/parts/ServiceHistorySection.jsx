import { Grid, Container, Stack } from "@mui/material";
import TimelineSection from "./TimelineSection.jsx";
import { fmtDate, safe } from "@/utils/format";

export default function SalaryStepsSection({ soldier }) {
  return (
    <>
      {/* <Container>
        <Stack spacing={2.5}>
          <PersonalInfoSection person={personForHeader} />
          <CurrentRankPositionSection soldier={soldier} />
          <IdentityDocsSection soldier={soldier} />
          <OrganizationSection soldier={soldier} />
          <EducationSkillsSection soldier={soldier} />
          <TimelineSection
            title="Quá trình công tác"
            items={soldier?.serviceHistory}
            fields={[
              (it) => `${fmtDate(it.from)} → ${fmtDate(it.to)}`,
              (it) => joinNonEmpty([it.unitPath, it.position], " • "),
              (it) => joinNonEmpty([it.decisionNo, it.note], " • "),
            ]}
          />
          <Grid container spacing={2}>
            <PromotionsSection soldier={soldier} />
            <SalaryStepsSection soldier={soldier} />
          </Grid>
          <Grid container spacing={2}>
            <AwardsSection soldier={soldier} />
            <DisciplinesSection soldier={soldier} />
          </Grid>
          <FamilySection family={soldier?.family} soldier={soldier} />
          <DocumentsSection soldier={soldier} />
          <NotesSection notes={soldier?.notes} />
        </Stack>
        <Grid item xs={12} md={6}>
          <TimelineSection
            title="Thăng cấp"
            items={soldier?.promotions}
            fields={[
              (it) => fmtDate(it.date),
              (it) => `${safe(it.fromRank)} → ${safe(it.toRank)}`,
              (it) => safe(it.decisionNo),
            ]}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <TimelineSection
            title="Bậc lương"
            items={soldier?.salarySteps}
            fields={[
              (it) => fmtDate(it.date),
              (it) => `Hệ số: ${safe(it.coefficient)}`,
              (it) => safe(it.decisionNo),
            ]}
          />
        </Grid>
      </Container> */}
    </>
  );
}
