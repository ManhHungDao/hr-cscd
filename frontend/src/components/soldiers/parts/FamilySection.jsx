import { Grid, Stack, Typography } from "@mui/material";
import SectionCard from "@/components/common/SectionCard.jsx";
import InfoRow from "@/components/common/InfoRow.jsx";
import PersonalInfoSection from "@/components/common/PersonalInfoSection.jsx";
import { fmtDate, joinNonEmpty, safe } from "@/utils/format";

export default function FamilySection({ family = {}, soldier = {} }) {
  const {
    parents,
    children = [],
    maritalStatus,
    spouseName,
    spouseBirthYear,
    spouseOccupation,
    spouseWorkplace,
    spousePhone,
    marriageDate,
  } = family || {};

  // Vợ/chồng
  const spouse = spouseName
    ? {
        name: spouseName,
        birthDate: spouseBirthYear
          ? new Date(spouseBirthYear, 0, 1)
          : undefined,
        phones: spousePhone ? [{ label: "Di động", number: spousePhone }] : [],
        currentAddress: soldier?.demographics?.currentAddress,
        note: joinNonEmpty([spouseOccupation, spouseWorkplace], " • "),
      }
    : null;

  // Cha
  const father = parents?.fatherName
    ? {
        name: parents.fatherName,
        birthDate: parents.fatherBirthYear
          ? new Date(parents.fatherBirthYear, 0, 1)
          : undefined,
        note: parents.fatherStatus,
        phones: parents.phone
          ? [{ label: "Liên hệ", number: parents.phone }]
          : [],
        address: parents.address,
      }
    : null;

  // Mẹ (fix bug: mother?.motherBirthYear -> parents.motherBirthYear)
  const mother = parents?.motherName
    ? {
        name: parents.motherName,
        birthDate: parents.motherBirthYear
          ? new Date(parents.motherBirthYear, 0, 1)
          : undefined,
        note: parents.motherStatus,
        phones: parents.phone
          ? [{ label: "Liên hệ", number: parents.phone }]
          : [],
        address: parents.address,
      }
    : null;

  return (
    <Stack spacing={2.5}>
      <SectionCard title="Tình trạng hôn nhân">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow label="Tình trạng" value={safe(maritalStatus)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow label="Ngày kết hôn" value={fmtDate(marriageDate)} />
          </Grid>
        </Grid>
      </SectionCard>

      {spouse && <PersonalInfoSection title="Vợ / Chồng" person={spouse} />}

      <SectionCard title="Cha mẹ">
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            {father ? (
              <PersonalInfoSection title="Cha" person={father} />
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Grid>
          <Grid item xs={12} md={6}>
            {mother ? (
              <PersonalInfoSection title="Mẹ" person={mother} />
            ) : (
              <Typography variant="body2">—</Typography>
            )}
          </Grid>
        </Grid>
      </SectionCard>

      <SectionCard title="Con cái">
        {children?.length ? (
          <Grid container spacing={2}>
            {children.map((c, idx) => (
              <Grid item xs={12} md={6} key={idx}>
                <PersonalInfoSection
                  title={`Con ${idx + 1}`}
                  person={{
                    name: c.name,
                    birthDate: c.birthDate,
                    gender: c.gender,
                    note: c.school,
                  }}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body2">Chưa có thông tin.</Typography>
        )}
      </SectionCard>
    </Stack>
  );
}
