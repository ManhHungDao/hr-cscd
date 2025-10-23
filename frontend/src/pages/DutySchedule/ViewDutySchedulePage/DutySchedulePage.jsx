// src/pages/DutySchedulePage.jsx
import { useMemo } from "react";
import { Container, Grid, Stack, Typography, Button } from "@mui/material";
import CommanderTodayCard from "@components/schedule/ViewDutySchedulePage/CommanderTodayCard";
import TargetCard from "@components/schedule/ViewDutySchedulePage/TargetCard";
import {
  dateForView,
  dayCommander,
  targets,
  buildTargetSchedule,
} from "./dutyMock";
import { useNavigate } from "react-router-dom";

export default function DutySchedulePage() {
  const navigate = useNavigate();

  // Chuẩn bị preview 1 vài slot đầu tiên cho mỗi mục tiêu
  const data = useMemo(() => {
    return targets.map((t) => {
      const expanded = buildTargetSchedule(t); // danh sách ca + slot
      const previewSlots = expanded.flatMap((s) => s.slots).slice(0, 5);
      return { ...t, previewSlots };
    });
  }, []);

  const openDetail = (target) => {
    navigate(`/duty-schedule/targets/${target.id}`);
  };

  const goManage = () => navigate("/duty-schedule/manage"); // placeholder

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <div>
          <Typography variant="h4">Lịch trực ngày {dateForView}</Typography>
          <Typography variant="body2" color="var(--color-text)">
            Tổng quan các ca trực của tất cả các mục tiêu trong ngày
          </Typography>
        </div>
        <Button variant="contained" onClick={goManage}>
          Quản lý lịch trực
        </Button>
      </Stack>

      <CommanderTodayCard commander={dayCommander} date={dateForView} />

      <Grid container spacing={3} sx={{ mt: 1 }}>
        {data.map((t) => (
          <Grid item xs={12} md={6} key={t.id}>
            <TargetCard target={t} onOpenDetail={openDetail} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
