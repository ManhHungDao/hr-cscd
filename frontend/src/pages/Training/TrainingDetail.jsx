import { useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import {
  Container,
  Stack,
  Typography,
  Chip,
  Card,
  CardContent,
  Divider,
  IconButton,
  Grid,
  List,
  ListItem,
  ListItemText,
  Breadcrumbs,
  Link,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { getTrainingById } from "@/store/trainingStore";
import { formatDateRange } from "@/utils/format";
import TrainingMetaRow from "@/components/training/TrainingMetaRow";

export default function TrainingDetail() {
  const { id } = useParams();
  const t = useMemo(() => getTrainingById(id), [id]);

  if (!t) {
    return (
      <Container maxWidth="lg" sx={{ py: 3 }}>
        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
          <IconButton component={RouterLink} to="/training" size="small">
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6">Không tìm thấy khóa huấn luyện</Typography>
        </Stack>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
        <IconButton
          component={RouterLink}
          to="/training"
          size="small"
          sx={{ color: "var(--color-text)" }}
        >
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h5" fontWeight={700}>
          {t.name}
        </Typography>
        <Chip
          size="small"
          label={
            t.status === "ongoing"
              ? "Đang diễn ra"
              : t.status === "planned"
              ? "Sắp diễn ra"
              : "Đã hoàn thành"
          }
          color={
            t.status === "finished"
              ? "success"
              : t.status === "ongoing"
              ? "primary"
              : "info"
          }
          variant={t.status === "ongoing" ? "filled" : "outlined"}
          sx={{ ml: 1 }}
        />
      </Stack>

      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Thời gian & địa điểm
              </Typography>
              <Typography variant="body1" fontWeight={600} sx={{ mb: 1 }}>
                {formatDateRange(t.startAt, t.endAt)} • {t.location}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Typography variant="subtitle2" color="text.secondary">
                Nội dung huấn luyện
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                {t.content}
              </Typography>

              {t.checkpoints?.length ? (
                <>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="subtitle2" color="text.secondary">
                    Kiểm tra/đánh giá
                  </Typography>
                  <List dense>
                    {t.checkpoints.map((c, idx) => (
                      <ListItem key={idx} disableGutters>
                        <ListItemText
                          primary={c.title}
                          secondary={`${new Date(
                            c.when
                          ).toLocaleString()} • Hình thức: ${c.type}${
                            c.note ? " • " + c.note : ""
                          }`}
                        />
                      </ListItem>
                    ))}
                  </List>
                </>
              ) : null}
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card variant="outlined" sx={{ borderRadius: 2, mb: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Ban huấn luyện
              </Typography>
              <List dense>
                {t.coaches.map((p, idx) => (
                  <ListItem key={idx} disableGutters>
                    <ListItemText
                      primary={`${p.rank ?? ""} ${p.name}${
                        p.role ? " — " + p.role : ""
                      }`}
                      secondary={p.phone ? `SĐT: ${p.phone}` : undefined}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>

          <Card variant="outlined" sx={{ borderRadius: 2 }}>
            <CardContent>
              <Typography variant="subtitle2" color="text.secondary">
                Thành phần tham gia
              </Typography>
              <TrainingMetaRow t={t} showCountsOnly />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
