// src/pages/TargetDutyDetailPage.jsx
import { useMemo } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Container,
  Stack,
  Typography,
  Button,
  Chip,
  IconButton,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { dateForView, targets, buildTargetSchedule } from "./dutyMock";
import ShiftTable from "@/components/schedule/ViewDutySchedulePage/ShiftTable";

export default function TargetDutyDetailPage() {
  const navigate = useNavigate();
  const { id } = useParams();

  const target = useMemo(() => targets.find((t) => t.id === id), [id]);
  const expandedShifts = useMemo(
    () => (target ? buildTargetSchedule(target) : []),
    [target]
  );

  if (!target) {
    return (
      <Container maxWidth="md" sx={{ py: 3 }}>
        <Typography variant="h6">Không tìm thấy mục tiêu</Typography>
        <Button sx={{ mt: 2 }} onClick={() => navigate(-1)}>
          Quay lại
        </Button>
      </Container>
    );
  }

  const goManage = () => navigate("/duty-schedule/manage");

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 2 }}
      >
        <Stack>
          <Stack direction="row" alignItems="center" spacing={1}>
            <IconButton
              color="inherit"
              size="small"
              onClick={() => navigate(-1)}
            >
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4">Chi tiết lịch trực</Typography>
            <Typography variant="h4" color="var(--color-text)">
              ngày {dateForView}
            </Typography>
          </Stack>
        </Stack>
        <Button variant="contained" onClick={goManage}>
          Quản lý lịch trực
        </Button>
      </Stack>

      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={2}
        alignItems={{ xs: "flex-start", sm: "center" }}
        sx={{ mb: 2 }}
      >
        <Typography variant="h6">{target.name}</Typography>
        <Chip label={target.location} size="small" />
      </Stack>

      <ShiftTable expandedShifts={expandedShifts} />
    </Container>
  );
}
