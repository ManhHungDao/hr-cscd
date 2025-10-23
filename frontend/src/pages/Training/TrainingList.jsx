import { useMemo, useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import {
  Box,
  Container,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardActionArea,
  CardContent,
  Chip,
  Divider,
  Button,
  Grid,
  Tooltip,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { formatDateRange } from "@/utils/format";
import { getAllTrainings } from "@/store/trainingStore";
import TrainingMetaRow from "@/components/training/TrainingMetaRow";

export default function TrainingList() {
  const [q, setQ] = useState("");

  const data = useMemo(() => {
    const trainings = getAllTrainings();
    const s = q.trim().toLowerCase();
    if (!s) return trainings;
    return trainings.filter((t) =>
      [t.name, t.content, t.location]
        .filter(Boolean)
        .some((f) => f.toLowerCase().includes(s))
    );
  }, [q]);

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Công tác huấn luyện
          </Typography>
          <Typography variant="body2" color="var(--color-text)">
            Danh sách các khóa/đợt huấn luyện gần đây. Tìm kiếm theo tên / nội
            dung.
          </Typography>
        </Box>

        <Button
          variant="contained"
          component={RouterLink}
          to="/training/manage"
        >
          Tạo khóa huấn luyện
        </Button>
      </Stack>

      <TextField
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Tìm kiếm huấn luyện theo tên..."
        fullWidth
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Grid container spacing={2} sx={{ mt: 1 }}>
        {data.map((t) => (
          <Grid item xs={12} md={6} key={t.id}>
            <Card variant="outlined" sx={{ borderRadius: 2 }}>
              <CardActionArea component={RouterLink} to={`/training/${t.id}`}>
                <CardContent>
                  <Stack spacing={1}>
                    <Stack
                      direction="row"
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Typography variant="h6" fontWeight={700} sx={{ pr: 1 }}>
                        {t.name}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        {t.status === "ongoing" && (
                          <Chip
                            size="small"
                            label="Đang diễn ra"
                            color="primary"
                          />
                        )}
                        {t.status === "planned" && (
                          <Chip
                            size="small"
                            label="Sắp diễn ra"
                            color="info"
                            variant="outlined"
                          />
                        )}
                        {t.status === "finished" && (
                          <Chip
                            size="small"
                            label="Đã hoàn thành"
                            color="success"
                            variant="outlined"
                          />
                        )}
                      </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {formatDateRange(t.startAt, t.endAt)} • {t.location}
                    </Typography>

                    <Divider flexItem sx={{ my: 1 }} />

                    <TrainingMetaRow t={t} dense />

                    {t.content && (
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mt: 1 }}
                      >
                        Nội dung: {t.content}
                      </Typography>
                    )}
                  </Stack>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}

        {data.length === 0 && (
          <Grid item xs={12}>
            <Box textAlign="center" py={8}>
              <Typography>Không tìm thấy kết quả phù hợp.</Typography>
            </Box>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}
