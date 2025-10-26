import { Grid, Divider } from "@mui/material";
import SectionCard from "@/components/common/SectionCard.jsx";
import InfoRow from "@/components/common/InfoRow.jsx";
import { fmtDate, safe } from "@/utils/format";

export default function OrganizationSection({ soldier }) {
  return (
    <>
      <SectionCard title="Thông tin tổ chức">
        <Grid container spacing={1.5}>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Ngày vào CAND"
              value={fmtDate(soldier?.party.joinedPoliceAt)}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <InfoRow
              label="Ngày vào Đảng"
              value={fmtDate(soldier?.party.joinedPartyAt)}
            />
          </Grid>
        </Grid>
      </SectionCard>
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
    </>
  );
}
