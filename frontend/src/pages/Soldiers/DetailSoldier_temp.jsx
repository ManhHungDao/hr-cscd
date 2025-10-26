import {
  Grid,
  Stack,
  Typography,
  Divider,
  CircularProgress,
} from "@mui/material";
import useFetch from "@/hooks/useFetch";
import SectionCard from "@/components/common/SectionCard.jsx";
import InfoRow from "@/components/common/InfoRow.jsx";
import PersonalInfoSection from "@/components/common/PersonalInfoSection.jsx";
import { fmtDate, joinNonEmpty, safe } from "@/utils/format";
import {
  TimelineList,
  DocumentsList,
  TagsRow,
  FamilySection,
} from "@/components/soldiers/parts";

/**
 * props:
 * - soldierId?: string
 * - soldier?: object (ưu tiên soldier nếu có)
 * - apiBase?: string (mặc định "/api/soldiers")
 */
export default function DetailSoldier({
  soldierId,
  soldier: soldierProp,
  apiBase = "/api/soldiers",
}) {
  const { data, loading, error } = useFetch(
    soldierProp ? null : soldierId ? `${apiBase}/${soldierId}` : null
  );
  const soldier = soldierProp || data;

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ py: 6 }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 1.5 }}>
          Đang tải dữ liệu chiến sĩ…
        </Typography>
      </Stack>
    );
  }
  if (error)
    return (
      <Typography color="error">Lỗi tải dữ liệu: {error.message}</Typography>
    );
  if (!soldier) return <Typography>Không có dữ liệu.</Typography>;

  const personForHeader = {
    avatar: soldier.avatar,
    fullName: soldier.fullName,
    birthDate: soldier?.demographics?.birthDate,
    birthPlace: soldier?.demographics?.birthPlace,
    hometown: soldier?.demographics?.hometown,
    currentAddress: soldier?.demographics?.currentAddress,
    phones: soldier?.contact?.phones,
    emails: soldier?.contact?.emails,
  };

  return (
    <Stack spacing={2.5}>
      {/* 1) Thông tin cá nhân */}
      <PersonalInfoSection person={personForHeader} />

      {/* 2) Cấp bậc - Chức vụ hiện tại */}
      <SectionCard title="Chức vụ & Cấp bậc hiện tại">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow label="Cấp bậc" value={safe(soldier?.current?.rank)} />
            <InfoRow label="Chức vụ" value={safe(soldier?.current?.position)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Hiệu lực từ"
              value={fmtDate(soldier?.current?.from)}
            />
            <InfoRow label="Đến" value={fmtDate(soldier?.current?.to)} />
          </Grid>
        </Grid>
        <Divider sx={{ my: 2 }} />
        <InfoRow label="Đơn vị (đường dẫn)" value={safe(soldier?.unitPath)} />
      </SectionCard>

      {/* 3) Giấy tờ định danh */}
      <SectionCard title="Giấy tờ định danh">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Mã lực lượng / Police Code"
              value={safe(soldier?.identityDocs?.policeCode)}
            />
            <InfoRow label="CCCD" value={safe(soldier?.identityDocs?.cccd)} />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Cấp ngày"
              value={fmtDate(soldier?.identityDocs?.cccdIssuedAt)}
            />
            <InfoRow
              label="Nơi cấp"
              value={safe(soldier?.identityDocs?.cccdIssuedPlace)}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 4) Tổ chức */}
      <SectionCard title="Thông tin tổ chức">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Ngày vào CAND"
              value={fmtDate(soldier?.party?.joinedPoliceAt)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Ngày vào Đảng"
              value={fmtDate(soldier?.party?.joinedPartyAt)}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 5) Học vấn & Kỹ năng */}
      <SectionCard title="Học vấn & Kỹ năng">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Trình độ"
              value={safe(soldier?.education?.degree)}
            />
            <InfoRow
              label="Chuyên ngành"
              value={safe(soldier?.education?.major)}
            />
            <InfoRow label="Hình thức" value={safe(soldier?.education?.mode)} />
            <InfoRow label="Xếp loại" value={safe(soldier?.education?.grade)} />
            <InfoRow
              label="Năm tốt nghiệp"
              value={safe(soldier?.education?.graduationYear)}
            />
            <InfoRow
              label="Trường"
              value={safe(soldier?.education?.institution)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Trình độ chính trị"
              value={safe(soldier?.skills?.politicsLevel)}
            />
            <InfoRow
              label="Trình độ CNTT"
              value={safe(soldier?.skills?.itLevel)}
            />
            <InfoRow
              label="Ngoại ngữ"
              value={joinNonEmpty(
                (soldier?.skills?.language || []).map(
                  (l) => `${l.name} (${l.level})`
                )
              )}
            />
            <InfoRow label="QP-AN" value={safe(soldier?.skills?.qpanLevel)} />
            <InfoRow
              label="GPLX"
              value={safe(soldier?.skills?.drivingLicense)}
            />
          </Grid>
        </Grid>
      </SectionCard>

      {/* 6) Quá trình công tác */}
      <SectionCard title="Quá trình công tác">
        <TimelineList
          items={soldier?.serviceHistory || []}
          fields={[
            (it) => `${fmtDate(it.from)} → ${fmtDate(it.to)}`,
            (it) => joinNonEmpty([it.unitPath, it.position], " • "),
            (it) => joinNonEmpty([it.decisionNo, it.note], " • "),
          ]}
        />
      </SectionCard>

      {/* 7) Thăng cấp & Bậc lương */}
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <SectionCard title="Thăng cấp">
            <TimelineList
              items={soldier?.promotions || []}
              fields={[
                (it) => fmtDate(it.date),
                (it) => `${safe(it.fromRank)} → ${safe(it.toRank)}`,
                (it) => safe(it.decisionNo),
              ]}
            />
          </SectionCard>
        </Grid>
        <Grid item xs={12} md={6}>
          <SectionCard title="Bậc lương">
            <TimelineList
              items={soldier?.salarySteps || []}
              fields={[
                (it) => fmtDate(it.date),
                (it) => `Hệ số: ${safe(it.coefficient)}`,
                (it) => safe(it.decisionNo),
              ]}
            />
          </SectionCard>
        </Grid>
      </Grid>

      {/* 8) Khen thưởng & Kỷ luật */}
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

      {/* 9) Gia đình */}
      <FamilySection family={soldier?.family} soldier={soldier} />

      {/* 10) Tài liệu */}
      <SectionCard title="Tài liệu">
        <DocumentsList docs={soldier?.documents || []} />
        <TagsRow
          title="Tags"
          items={[
            ...new Set((soldier?.documents || []).flatMap((d) => d.tags || [])),
          ]}
        />
      </SectionCard>

      {/* 11) Ghi chú */}
      {soldier?.notes && (
        <SectionCard title="Ghi chú">
          <Typography variant="body1">{soldier.notes}</Typography>
        </SectionCard>
      )}
    </Stack>
  );
}
