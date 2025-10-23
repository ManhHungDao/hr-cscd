import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Chip,
  Container,
  Divider,
  Grid2 as Grid,
  List,
  ListItem,
  ListItemText,
  Stack,
  Typography,
  Avatar,
  useTheme,
} from "@mui/material";
import CircleIcon from "@mui/icons-material/Circle";
import AssessmentIcon from "@mui/icons-material/Assessment";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import ScheduleIcon from "@mui/icons-material/Schedule";

/**
 * DashboardOverview.jsx
 * Một bố cục dashboard theo ảnh mẫu, viết bằng MUI + React (không dùng @mui/lab).
 * - Thẻ thống kê nhanh
 * - Tình hình hiện diện (biểu đồ donut SVG thuần)
 * - Lịch trực hôm nay
 * - Thông báo & Quyết định mới
 * - Cảnh báo sắp hết hạn
 */

// ---- Mock data ----
const mockStats = [
  { label: "Tổng số", total: 1250, present: 980 },
  { label: "Sĩ quan", total: 400, present: 400 },
  { label: "Hạ sĩ quan", total: 400, present: 400 },
  { label: "Chiến sĩ", total: 700, present: 700 },
];

const mockPresence = {
  segments: [
    { label: "Đang trực", value: 980, color: "#1f9d55" }, // green
    { label: "Đi công tác", value: 100, color: "#facc15" }, // yellow
    { label: "Vắng mặt", value: 80, color: "#ef4444" }, // red
  ],
};

const mockShifts = {
  current: { time: "06:00–14:00", type: "Phụ trách" },
  list: [
    { shift: "Ca 1", officer: "Trung úy Nguyễn Văn A" },
    { shift: "Ca 2", officer: "Thượng úy Lê Thị B" },
  ],
};

const mockAnnouncements = [
  {
    title: "QĐ số 25/QĐ-BCA V/v Điều động tọa",
  },
  {
    title: "TB số 120-TB-PC02 V/v Tập huấn nghiệp vụ mới",
  },
];

const mockExpiring = [
  {
    title: "Hợp đồng",
    detail: "5 cán bộ (30 ngày)",
    level: "info", // info | warn
  },
  {
    title: "Kiểm tra thể lực",
    detail: "10 cán bộ (15 ngày)",
    level: "info",
  },
  {
    title: "Chứng chỉ nghiệp vụ",
    detail: "3 cán bộ (≤ 45 ngày)",
    level: "warn",
  },
];

// ---- Small helpers ----
function CardBox({ icon, title, action, children }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        background: "linear-gradient(180deg,#fff, #fafafa)",
      }}
    >
      <CardHeader
        avatar={icon}
        titleTypographyProps={{ fontWeight: 700, fontSize: 18 }}
        title={title}
        action={action}
      />
      <Divider sx={{ opacity: 0.6 }} />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function StatRow({ label, total, present }) {
  return (
    <Stack direction="row" alignItems="center" spacing={2} py={0.5}>
      <Typography sx={{ color: "text.secondary", minWidth: 120 }}>
        {label}:
      </Typography>
      <Typography sx={{ fontWeight: 800, fontSize: 22, minWidth: 80 }}>
        {total.toLocaleString()}
      </Typography>
      <Typography
        sx={{ fontWeight: 800, fontSize: 22, color: "text.disabled" }}
      >
        {present.toLocaleString()}
      </Typography>
    </Stack>
  );
}

function LegendItem({ color, label, value }) {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <CircleIcon sx={{ fontSize: 12, color }} />
      <Typography variant="body2" sx={{ minWidth: 92 }}>
        {label}:
      </Typography>
      <Typography fontWeight={700}>{value}</Typography>
    </Stack>
  );
}

// Simple SVG donut chart component (no external deps)
function DonutChart({ data, size = 160, thickness = 22 }) {
  const radius = size / 2;
  const innerRadius = radius - thickness;
  const circumference = 2 * Math.PI * innerRadius;
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  let offset = 0;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${radius},${radius})`}>
        {data.map((d, idx) => {
          const fraction = d.value / total;
          const dash = circumference * fraction;
          const circle = (
            <circle
              key={idx}
              r={innerRadius}
              fill="transparent"
              stroke={d.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return circle;
        })}
        <circle
          r={innerRadius}
          fill="transparent"
          stroke="#e5e7eb"
          strokeWidth={thickness}
          opacity={0.25}
        />
        <text
          textAnchor="middle"
          dominantBaseline="middle"
          fontWeight="800"
          fontSize={18}
          fill="#111827"
        >
          {total}
        </text>
      </g>
    </svg>
  );
}

export default function DashboardOverview() {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: "var(--color-bg)",
        minHeight: "100vh",
        py: 4,
      }}
    >
      <Container maxWidth="xl">
        {/* Row 1 */}
        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox
              title="Thống kê Quân số nhanh"
              icon={
                <Avatar sx={{ bgcolor: "primary.main" }}>
                  <AssessmentIcon />
                </Avatar>
              }
            >
              <Stack spacing={1.2}>
                {mockStats.map((s, i) => (
                  <StatRow key={i} {...s} />
                ))}
              </Stack>
            </CardBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox
              title="Tình hình Hiện diện"
              icon={
                <Avatar sx={{ bgcolor: "success.main" }}>
                  <CircleIcon />
                </Avatar>
              }
            >
              <Stack
                direction="row"
                spacing={3}
                alignItems="center"
                justifyContent="space-between"
              >
                <DonutChart data={mockPresence.segments} />
                <Stack spacing={1.2}>
                  {mockPresence.segments.map((s, idx) => (
                    <LegendItem
                      key={idx}
                      color={s.color}
                      label={s.label}
                      value={s.value}
                    />
                  ))}
                </Stack>
              </Stack>
            </CardBox>
          </Grid>
        </Grid>

        {/* Row 2 */}
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox
              title="Lịch trực Hôm nay"
              icon={
                <Avatar sx={{ bgcolor: "info.main" }}>
                  <ScheduleIcon />
                </Avatar>
              }
              action={<Chip size="small" label={mockShifts.current.type} />}
            >
              <Stack spacing={1.5}>
                <Box
                  sx={{
                    display: "inline-flex",
                    alignItems: "center",
                    borderRadius: 1.2,
                    px: 1,
                    py: 0.5,
                    bgcolor: theme.palette.grey[100],
                    width: "fit-content",
                  }}
                >
                  <Typography variant="body2">
                    Ca trực {mockShifts.current.time}
                  </Typography>
                </Box>
                <List disablePadding>
                  {mockShifts.list.map((it, idx) => (
                    <ListItem key={idx} sx={{ px: 0 }}>
                      <ListItemText
                        primary={
                          <Stack direction="row" spacing={2}>
                            <Typography sx={{ minWidth: 52 }}>
                              {it.shift}
                            </Typography>
                            <Typography fontWeight={600}>
                              {it.officer}
                            </Typography>
                          </Stack>
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              </Stack>
            </CardBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox
              title="Thông báo & Quyết định mới"
              icon={
                <Avatar sx={{ bgcolor: "warning.main" }}>
                  <NotificationsActiveIcon />
                </Avatar>
              }
            >
              <List>
                {mockAnnouncements.map((a, i) => (
                  <ListItem key={i} sx={{ px: 0 }}>
                    <ListItemText
                      primary={
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {a.title}
                        </Typography>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </CardBox>
          </Grid>
        </Grid>

        {/* Row 3 */}
        <Grid container spacing={3} sx={{ mt: 0.5 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox
              title="Cảnh báo sắp hết hạn"
              icon={
                <Avatar sx={{ bgcolor: "error.main" }}>
                  <NotificationsActiveIcon />
                </Avatar>
              }
            >
              <List>
                {mockExpiring.map((e, i) => (
                  <ListItem
                    key={i}
                    sx={{
                      px: 0,
                      borderRadius: 1.5,
                      mb: 1,
                      bgcolor: e.level === "warn" ? "#fff7ed" : "#f5f7ff",
                    }}
                  >
                    <Stack
                      direction="row"
                      spacing={1.5}
                      alignItems="center"
                      sx={{ width: "100%", p: 1.2 }}
                    >
                      <Chip
                        size="small"
                        label={e.title}
                        color={e.level === "warn" ? "warning" : "info"}
                      />
                      <Typography fontWeight={600}>{e.detail}</Typography>
                      <Box sx={{ flexGrow: 1 }} />
                      <CircleIcon
                        sx={{
                          fontSize: 10,
                          color: e.level === "warn" ? "#f59e0b" : "#3b82f6",
                        }}
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>
            </CardBox>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <CardBox title="Công tác huấn luyện" icon={<Avatar>🗒️</Avatar>}>
              <Typography variant="body2" color="text.secondary">
                Đây là khu vực dữ liệu ảo. Bạn có thể thay bằng API thật
                (REST/GraphQL) hoặc Redux query.
              </Typography>
            </CardBox>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
