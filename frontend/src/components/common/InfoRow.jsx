import { Stack, Typography } from "@mui/material";

export default function InfoRow({ label, value, vertical = false }) {
  if (vertical) {
    return (
      <Stack spacing={0.5}>
        <Typography variant="caption" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="body1">{value ?? "—"}</Typography>
      </Stack>
    );
  }
  return (
    <Stack direction="row" spacing={1.5} alignItems="baseline">
      <Typography variant="body2" color="text.secondary" sx={{ minWidth: 160 }}>
        {label}
      </Typography>
      <Typography variant="body1" sx={{ flex: 1 }}>
        {value ?? "—"}
      </Typography>
    </Stack>
  );
}
