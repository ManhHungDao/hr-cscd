import { Grid } from "@mui/material";
import SectionCard from "@/components/common/SectionCard.jsx";
import InfoRow from "@/components/common/InfoRow.jsx";
import { joinNonEmpty, safe } from "@/utils/format";

export default function EducationSkillsSection({ soldier }) {
  const edu = soldier?.education || {};
  const sk = soldier?.skills || {};
  return (
    <SectionCard title="Học vấn & Kỹ năng">
      <Grid container spacing={1.5}>
        <Grid item xs={12} md={6}>
          <InfoRow label="Trình độ" value={safe(edu.degree)} />
          <InfoRow label="Chuyên ngành" value={safe(edu.major)} />
          <InfoRow label="Hình thức" value={safe(edu.mode)} />
          <InfoRow label="Xếp loại" value={safe(edu.grade)} />
          <InfoRow label="Năm tốt nghiệp" value={safe(edu.graduationYear)} />
          <InfoRow label="Trường" value={safe(edu.institution)} />
        </Grid>
        <Grid item xs={12} md={6}>
          <InfoRow label="Trình độ chính trị" value={safe(sk.politicsLevel)} />
          <InfoRow label="Trình độ CNTT" value={safe(sk.itLevel)} />
          <InfoRow
            label="Ngoại ngữ"
            value={joinNonEmpty(
              (sk.language || []).map((l) => `${l.name} (${l.level})`)
            )}
          />
          <InfoRow label="QP-AN" value={safe(sk.qpanLevel)} />
          <InfoRow label="GPLX" value={safe(sk.drivingLicense)} />
        </Grid>
      </Grid>
    </SectionCard>
  );
}
