import { Grid, Stack, Typography } from "@mui/material";
import { labelize } from "@/utils/format";

export default function InfoGrid({ data }) {
  const entries = Object.entries(data || {});
  if (!entries.length)
    return <Typography variant="body2" color="text.secondary">Chưa có dữ liệu</Typography>;
  return (
    <Grid container spacing={2}>
      {entries.map(([k, v]) => (
        <Grid item xs={12} md={6} key={k}>
          <Stack
            sx={{
              bgcolor: "grey.50",
              border: (t) => `1px solid ${t.palette.divider}`,
              borderRadius: 2,
              p: 1.25,
            }}
            spacing={0.5}
          >
            <Typography variant="body2" color="text.secondary">{labelize(k)}</Typography>
            <Typography fontWeight={600}>{String(v)}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}
