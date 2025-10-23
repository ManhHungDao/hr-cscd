import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Stack,
  Tab,
  Tabs,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate } from "react-router-dom";
// ---- mock profile ----
const mockProfile = {
  avatar: "https://i.pravatar.cc/120?img=35",
  name: "THƯỢNG ÚY LÊ THANH BÌNH",
  rank: "Thượng úy",
  position: "Tiểu đội trưởng",
  code: "A213-B456",
  unitLine: "Trung đội 1, Đại đội C1, 6 Hàoỉ",
  basic: {
    "Ngày Sinh": "15/03/1990",
    "Nơi Sinh": "Hà Nội",
    "Quê Quán": "Nam Định",
    "Địa chỉ thường trú":
      "Địa chỉ Số 123, P. Trần Hưng Đạo, Q Hoàn Kiếm, TP. Hà Nội",
  },
  contact: {
    "Số Điện Thoại": "SDT: 0912 345 778",
    Email: "binhlt, binhlt@cand.gov.vn",
    "Tôn Giáo": "Không",
  },
  party: {
    "Ngày vào Công an nhân dân": "15/03/1990",
    "Ngày vào Đảng": "15/03/1990",
  },
};

function SectionCard({ title, children, action }) {
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
        background: "linear-gradient(180deg,#fff,#fafafa)",
      }}
    >
      <CardHeader
        titleTypographyProps={{ fontWeight: 700, fontSize: 16 }}
        title={title}
        action={action}
      />
      <Divider />
      <CardContent>{children}</CardContent>
    </Card>
  );
}

function InfoGrid({ data }) {
  // Render key:value như description list, 2 cột
  const keys = Object.keys(data || {});
  return (
    <Grid container spacing={2}>
      {keys.map((k) => (
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
            <Typography variant="body2" color="text.secondary">
              {k.replaceAll(/([A-Z])/g, " $1")}
            </Typography>
            <Typography fontWeight={600}>{data[k]}</Typography>
          </Stack>
        </Grid>
      ))}
    </Grid>
  );
}

// Tab Panel thuần (không @mui/lab)
function TabPanel({ value, index, children }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      aria-labelledby={`tab-${index}`}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}

export default function SoldierDetail() {
  const navigate = useNavigate();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  return (
    <Box sx={{ bgcolor: theme.palette.grey[100], minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        {/* Header */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            mb: 2,
            background: "linear-gradient(180deg,#fff,#fafafa)",
          }}
        >
          <CardContent>
            <Stack direction="row" spacing={2} alignItems="center">
              <IconButton
                color="inherit"
                size="small"
                onClick={() => navigate(-1)}
              >
                <ArrowBackIcon />
              </IconButton>

              <Avatar
                src={mockProfile.avatar}
                sx={{
                  width: 76,
                  height: 76,
                  border: "3px solid #fff",
                  boxShadow: 1,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={900} fontSize={22} lineHeight={1.2}>
                  {mockProfile.name}
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Cấp bậc: <b>{mockProfile.rank}</b> &nbsp;•&nbsp; Chức vụ:{" "}
                  <b>{mockProfile.position}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  Số hiệu CAND: <b>{mockProfile.code}</b>
                </Typography>
                <Typography color="text.secondary" variant="body2">
                  {mockProfile.unitLine}
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<EditIcon />}
                >
                  Sửa hồ sơ
                </Button>
                <Button variant="outlined" startIcon={<PrintIcon />}>
                  In Sơ yếu công tác
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Card
          elevation={0}
          sx={{
            borderRadius: 3,
            boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
            background: "linear-gradient(180deg,#fff,#fafafa)",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 2,
              borderBottom: (t) => `1px solid ${t.palette.divider}`,
              "& .MuiTab-root": {
                textTransform: "none",
                fontWeight: 600,
                mr: 0.5,
              },
              "& .Mui-selected": { color: "success.main" },
              "& .MuiTabs-indicator": {
                bgcolor: "success.main",
                height: 3,
                borderRadius: 3,
              },
            }}
          >
            <Tab id="tab-0" label="Thông tin cơ bản" />
            <Tab id="tab-1" label="Quá trình Công tác" />
            <Tab id="tab-2" label="Đào tạo & Huấn luyện" />
            <Tab id="tab-3" label="Khen thưởng Kỷ luật" />
            <Tab id="tab-4" label="Lịch sử Chấm công" />
            <Tab id="tab-5" label="Hồ sơ liên quan" />
          </Tabs>

          <Box>
            {/* TAB 0: Thông tin cơ bản */}
            <TabPanel value={tab} index={0}>
              <Grid container spacing={2.5}>
                <Grid item xs={12}>
                  <SectionCard title="Sơ yếu lý lịch">
                    <InfoGrid data={mockProfile.basic} />
                  </SectionCard>
                </Grid>
                <Grid item xs={12}>
                  <SectionCard
                    title="Thông tin liên lạc"
                    action={
                      <Chip
                        size="small"
                        label="Cập nhật gần đây"
                        color="info"
                      />
                    }
                  >
                    <InfoGrid data={mockProfile.contact} />
                  </SectionCard>
                </Grid>
                <Grid item xs={12}>
                  <SectionCard title="Thông tin Đảng/Đoàn">
                    <InfoGrid data={mockProfile.party} />
                  </SectionCard>
                </Grid>
              </Grid>
            </TabPanel>

            {/* TAB 1: Quá trình Công tác */}
            <TabPanel value={tab} index={1}>
              <SectionCard
                title="Quá trình công tác"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Chưa có dữ liệu"
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Thêm bảng dòng thời gian/biểu mẫu các quyết
                  định, điều động, bổ nhiệm, lương, … ở đây.
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 2: Đào tạo & Huấn luyện */}
            <TabPanel value={tab} index={2}>
              <SectionCard
                title="Đào tạo & Huấn luyện"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Chưa có dữ liệu"
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Thêm danh sách khóa đào tạo, chứng chỉ, kết
                  quả bắn súng, võ thuật, v.v…
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 3: Khen thưởng Kỷ luật */}
            <TabPanel value={tab} index={3}>
              <SectionCard
                title="Khen thưởng & Kỷ luật"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Chưa có dữ liệu"
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Thêm bảng khen thưởng, hình thức kỷ luật (nếu
                  có) và tài liệu đính kèm.
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 4: Lịch sử Chấm công */}
            <TabPanel value={tab} index={4}>
              <SectionCard
                title="Lịch sử Chấm công"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Chưa có dữ liệu"
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Thêm bảng chấm công theo ngày/ca, vắng phép,
                  công tác, tăng ca…
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 5: Hồ sở tải lên */}
            <TabPanel value={tab} index={5}>
              <SectionCard
                title="Hồ sở tải lên"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label="Chưa có dữ liệu"
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Tải lên các file/ tệp liên quan đến cán bộ
                </Typography>
              </SectionCard>
            </TabPanel>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
