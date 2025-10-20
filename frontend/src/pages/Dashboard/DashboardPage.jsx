import { Grid, Paper, Typography } from "@mui/material";

export default function DashboardPage() {
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Paper className="card"><Typography variant="h6">Tổng quan</Typography></Paper>
      </Grid>
      <Grid item xs={12} md={6}>
        <Paper className="card"><Typography variant="h6">Chỉ số nhanh</Typography></Paper>
      </Grid>
    </Grid>
  );
}
