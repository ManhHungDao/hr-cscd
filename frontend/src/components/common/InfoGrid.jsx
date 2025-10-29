import { Grid, Stack, Typography } from "@mui/material";
import { labelize } from "@/utils/format";

export default function InfoGrid({ data }) {
  const entries = Object.entries(data || {});
  if (!entries.length)
    return (
      <Typography variant="body2" color="text.secondary">
        Chưa có dữ liệu
      </Typography>
    );
  return (
    <Grid container spacing={2}>
      {entries.map(([k, v]) => (
        <Grid item xs={12} md={6} key={k}>
          <Typography variant="body2" color="text.secondary">
            {k}
          </Typography>
          <Typography>{String(v)}</Typography>
        </Grid>
      ))}
    </Grid>
  );
}
