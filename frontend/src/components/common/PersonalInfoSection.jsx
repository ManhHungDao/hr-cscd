import { Avatar, Chip, Grid, Stack, Typography, Divider } from "@mui/material";
import SectionCard from "./SectionCard.jsx";
import InfoRow from "./InfoRow.jsx";
import { fmtDate, joinNonEmpty, safe } from "@/utils/format";

function PhoneChips({ phones }) {
  const items = (phones || []).map((p) =>
    typeof p === "string" ? { label: "Khác", number: p } : p
  );
  if (!items.length) return <Typography variant="body2">—</Typography>;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.map((p, idx) => (
        <Chip
          key={idx}
          size="small"
          label={`${p.label || "SĐT"}: ${p.number}`}
        />
      ))}
    </Stack>
  );
}

function EmailChips({ emails }) {
  const items = (emails || []).map((e) =>
    typeof e === "string" ? { label: "Khác", address: e } : e
  );
  if (!items.length) return <Typography variant="body2">—</Typography>;
  return (
    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
      {items.map((e, idx) => (
        <Chip
          key={idx}
          size="small"
          label={`${e.label || "Email"}: ${e.address}`}
        />
      ))}
    </Stack>
  );
}

/**
 * props:
 * - title?: string
 * - person: {
 *     avatar?, fullName?, name?,
 *     gender?, birthDate?, birthPlace?, hometown?, permanentAddress?,
 *     currentAddress?: { line?, ward?, province? },
 *     phones?: [{label,number}|string], emails?: [{label,address}|string]
 *   }
 * - rightExtra?: ReactNode
 */
export default function PersonalInfoSection({
  title = "Thông tin cá nhân",
  person = {},
  rightExtra,
}) {
  const displayName = person.fullName || person.name || "—";
  const currentAddr = person.currentAddress
    ? joinNonEmpty(
        [
          person.currentAddress.line,
          person.currentAddress.ward,
          person.currentAddress.province,
        ],
        ", "
      )
    : person.address || person.permanentAddress || "—";

  return (
    <SectionCard title={title} action={rightExtra}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm="auto">
          <Avatar
            src={person.avatar || ""}
            alt={displayName}
            sx={{ width: 88, height: 88, borderRadius: 3 }}
          />
        </Grid>
        <Grid item xs>
          <Stack spacing={1.2}>
            <Typography variant="h6">{displayName}</Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12} md={6}>
                <InfoRow label="Giới tính" value={safe(person.gender)} />
                <InfoRow label="Ngày sinh" value={fmtDate(person.birthDate)} />
                <InfoRow label="Nơi sinh" value={safe(person.birthPlace)} />
                <InfoRow label="Quê quán" value={safe(person.hometown)} />
              </Grid>
              <Grid item xs={12} md={6}>
                <InfoRow label="Địa chỉ hiện tại" value={currentAddr} />
                <InfoRow
                  label="Điện thoại"
                  value={
                    <PhoneChips
                      phones={person.phones || person.contact?.phones}
                    />
                  }
                />
                <InfoRow
                  label="Email"
                  value={
                    <EmailChips
                      emails={person.emails || person.contact?.emails}
                    />
                  }
                />
              </Grid>
            </Grid>
          </Stack>
        </Grid>
      </Grid>

      {/* Nếu cần chia khối dưới */}
      {person.note && (
        <>
          <Divider sx={{ my: 2 }} />
          <InfoRow label="Ghi chú" value={person.note} />
        </>
      )}
    </SectionCard>
  );
}
