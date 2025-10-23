// pages/DutySchedulePage.jsx
import { Container, Grid, Box, Typography, Paper } from "@mui/material";
import CommanderCard from "@components/schedule/ViewDutySchedulePage/CommanderCard";
import ShiftList from "@components/schedule/ViewDutySchedulePage/ShiftList";
import { dutyData, dateForView } from "./mockData";

export default function DutySchedulePage() {
  // Có thể truyền date qua props / route param; hiện dùng mock date
  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Typography variant="h4" gutterBottom>
        Lịch trực — {dateForView}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        Bảng xem tổng quan các mục tiêu và ca trực trong ngày
      </Typography>

      <Grid container spacing={3}>
        {dutyData.map((target) => (
          <Grid item xs={12} md={6} key={target.id}>
            <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="h6">{target.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {target.location}
                </Typography>
              </Box>

              <CommanderCard commander={target.commander} />

              <Box sx={{ mt: 2 }}>
                <ShiftList shifts={target.shifts} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
