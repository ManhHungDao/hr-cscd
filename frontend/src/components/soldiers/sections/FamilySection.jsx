// src/components/soldiers/sections/FamilySection.jsx
import {
  Box,
  Chip,
  Grid,
  Stack,
  Typography,
  Card,
  CardContent,
  Divider,
} from "@mui/material";
import SectionCard from "@/components/common/SectionCard";
import { fmtDate } from "@/utils/format";

// Sắp xếp theo “độ gần” gia đình (tuỳ biến được)
const RELATION_ORDER = ["Bố", "Mẹ", "Vợ", "Chồng", "Con", "Anh", "Chị", "Em"];
function relationPriority(r) {
  const idx = RELATION_ORDER.indexOf(r);
  return idx === -1 ? 999 : idx;
}

function Field({ label, value }) {
  if (!value) return null;
  return (
    <Stack direction="row" spacing={1} alignItems="baseline">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 140 }}>
        {label}
      </Typography>
      <Typography variant="body2">{value}</Typography>
    </Stack>
  );
}

function FamilyMemberCard({ m }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        borderRadius: 2,
        border: "1px solid",
        borderColor: "divider",
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      <CardContent sx={{ p: 2 }}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          mb={1}
        >
          <Typography
            variant="subtitle1"
            fontWeight={700}
            sx={{ lineHeight: 1.2 }}
          >
            {m.fullName || "(Không tên)"}
          </Typography>
          {m.relation && <Chip size="small" label={m.relation} />}
        </Stack>

        <Divider sx={{ my: 1.5 }} />

        <Stack spacing={0.75}>
          <Field label="Ngày sinh" value={fmtDate(m.birthDate)} />
          <Field label="Nghề nghiệp" value={m.occupation} />
          <Field label="Quê quán" value={m.hometown} />
          <Field label="Địa chỉ thường trú" value={m.permanentAddress} />
          <Field label="Địa chỉ hiện tại" value={m.address} />
          <Field label="Điện thoại" value={m.phone} />
        </Stack>
      </CardContent>
    </Card>
  );
}

/**
 * props:
 *  - data: { members: FamilySubSchema[] }  HOẶC  FamilySubSchema[]
 *  - loading?: boolean
 *  - err?: string | null
 */
export default function FamilySection({ data, loading, err }) {
  const members = Array.isArray(data) ? data : data?.members || [];

  return (
    <SectionCard
      title={
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="h6" fontWeight={800}>
            Quan hệ gia đình
          </Typography>
          <Chip size="small" variant="outlined" label={`${members.length}`} />
        </Stack>
      }
    >
      {loading ? (
        <Box sx={{ p: 2 }}>Đang tải danh sách người thân…</Box>
      ) : err ? (
        <Typography color="error">
          Không thể tải người thân: {String(err)}
        </Typography>
      ) : members.length === 0 ? (
        <Typography variant="body2" color="text.secondary">
          Chưa có thông tin người thân.
        </Typography>
      ) : (
        <Grid container spacing={2}>
          {members
            .slice()
            .sort(
              (a, b) =>
                relationPriority(a?.relation) - relationPriority(b?.relation)
            )
            .map((m, idx) => (
              <Grid
                item
                xs={12}
                sm={6}
                md={4}
                key={`${m?.fullName || "member"}-${idx}`}
              >
                <FamilyMemberCard m={m} />
              </Grid>
            ))}
        </Grid>
      )}
    </SectionCard>
  );
}
