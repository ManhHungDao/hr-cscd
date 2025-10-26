import { useEffect, useMemo, useState } from "react";
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
  Typography,
  useTheme,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PrintIcon from "@mui/icons-material/Print";
import EditIcon from "@mui/icons-material/Edit";
import { useNavigate, useParams } from "react-router-dom";

/* ----------------- helpers ----------------- */
const fmtDate = (v) => {
  if (!v) return "";
  try {
    const d = new Date(v);
    if (Number.isNaN(d.getTime())) return "";
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = d.getFullYear();
    return `${dd}/${mm}/${yyyy}`;
  } catch {
    return "";
  }
};

const joinAddress = (addr) =>
  [addr?.line, addr?.ward, addr?.province].filter(Boolean).join(", ");

const nonEmpty = (obj) =>
  Object.fromEntries(
    Object.entries(obj || {}).filter(
      ([, v]) => v !== undefined && v !== null && String(v).trim() !== ""
    )
  );

/* ----------------- small UI pieces ----------------- */
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
  const { id } = useParams(); // lấy :id từ URL
  const navigate = useNavigate();
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  const [raw, setRaw] = useState(null);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        setErr("");
        const res = await fetch(
          `http://localhost:4000/api/soldiers/68fb8438067657a0a1e2e328`,
          {
            // const res = await fetch(`http://localhost:4000/api/soldiers/${id}`, {
            headers: { "Content-Type": "application/json" },
          }
        );
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        if (alive) setRaw(data);
      } catch (e) {
        if (alive) setErr(e?.message || "Lỗi tải dữ liệu");
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [id]);

  // Map dữ liệu API -> ViewModel giống mockProfile cũ
  const profile = useMemo(() => {
    const d = raw || {};
    const phones = (d?.contact?.phones || [])
      .map((p) => `${p.label}: ${p.number}`)
      .join(" • ");
    const emails = (d?.contact?.emails || [])
      .map((e) => `${e.label}: ${e.address}`)
      .join(" • ");

    const emergency =
      d?.contact?.emergencyContact &&
      `${d.contact.emergencyContact.name} (${d.contact.emergencyContact.relation}) - ${d.contact.emergencyContact.phone}`;

    return {
      avatar: d.avatar || "https://i.pravatar.cc/120?img=35",
      name: (d.fullName || "").toUpperCase(),
      rank: d.current?.rank || "",
      position: d.current?.position || "",
      code: d.identityDocs?.policeCode || "",
      unitLine: d.unitPath || "",
      basic: nonEmpty({
        "Ngày sinh": fmtDate(d.demographics?.birthDate),
        "Nơi sinh": d.demographics?.birthPlace,
        "Quê quán": d.demographics?.hometown,
        "Địa chỉ thường trú": d.demographics?.permanentAddress,
        "Địa chỉ hiện tại": joinAddress(d.demographics?.currentAddress),
        "Nhóm máu": d.demographics?.bloodType,
        "Tình trạng hôn nhân": d.demographics?.maritalStatus,
        "Dân tộc": "dsadsa",
        "Tôn Giáo": d.demographics?.religion,
        "Số con": d.demographics?.childrenCount,
      }),
      contact: nonEmpty({
        "Số Điện Thoại": phones,
        "Hộp thư": emails,
      }),
      party: nonEmpty({
        "Ngày vào Công an nhân dân": fmtDate(d.party?.joinedPoliceAt),
        // API mẫu không có ngày vào Đảng → bỏ qua nếu trống
      }),
      // để dùng ở các tab khác sau này:
      trainings: d.trainings || [],
      serviceHistory: d.serviceHistory || [],
      awards: d.awards || [],
      disciplines: d.disciplines || [],
      documents: d.documents || [],
      attendance: d.attendance || null,
    };
  }, [raw]);

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
                src={profile.avatar}
                sx={{
                  width: 76,
                  height: 76,
                  border: "3px solid #fff",
                  boxShadow: 1,
                }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography fontWeight={900} fontSize={22} lineHeight={1.2}>
                  {loading ? "Đang tải..." : profile.name || "(Không tên)"}
                </Typography>

                {err ? (
                  <Typography color="error" variant="body2">
                    Lỗi tải hồ sơ: {err}
                  </Typography>
                ) : (
                  <>
                    <Typography color="text.secondary" variant="body2">
                      Cấp bậc: <b>{profile.rank}</b> &nbsp;•&nbsp; Chức vụ:{" "}
                      <b>{profile.position}</b>
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      Số hiệu CAND: <b>{profile.code}</b>
                    </Typography>
                    <Typography color="text.secondary" variant="body2">
                      {profile.unitLine}
                    </Typography>
                  </>
                )}
              </Box>

              <Stack direction="row" spacing={1}>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<EditIcon />}
                  disabled={!!err || loading}
                >
                  Sửa hồ sơ
                </Button>
                <Button
                  variant="outlined"
                  startIcon={<PrintIcon />}
                  disabled={!!err || loading}
                >
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
                  <SectionCard
                    title="Sơ yếu lý lịch"
                    action={
                      loading ? (
                        <Chip size="small" label="Đang tải" />
                      ) : (
                        <Chip size="small" label="Tải từ API" color="info" />
                      )
                    }
                  >
                    {err ? (
                      <Typography color="error">
                        Không thể tải dữ liệu.
                      </Typography>
                    ) : (
                      <InfoGrid data={profile.basic} />
                    )}
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
                    {err ? (
                      <Typography color="error">
                        Không thể tải dữ liệu.
                      </Typography>
                    ) : (
                      <InfoGrid data={profile.contact} />
                    )}
                  </SectionCard>
                </Grid>
                <Grid item xs={12}>
                  <SectionCard title="Thông tin gia đình">
                    {err ? (
                      <Typography color="error">
                        Không thể tải dữ liệu.
                      </Typography>
                    ) : (
                      <InfoGrid data={profile.party} />
                    )}
                  </SectionCard>
                </Grid>
                <Grid item xs={12}>
                  <SectionCard title="Thông tin Đảng/Đoàn">
                    {err ? (
                      <Typography color="error">
                        Không thể tải dữ liệu.
                      </Typography>
                    ) : (
                      <InfoGrid data={profile.party} />
                    )}
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
                    label={
                      (profile.serviceHistory || []).length
                        ? `${profile.serviceHistory.length} mục`
                        : "Chưa có dữ liệu"
                    }
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Sẽ hiển thị bảng timeline từ API{" "}
                  <code>serviceHistory</code>.
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
                    label={
                      (profile.trainings || []).length
                        ? `${profile.trainings.length} khóa`
                        : "Chưa có dữ liệu"
                    }
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Sẽ hiển thị danh sách <code>trainings</code>{" "}
                  từ API.
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 3: Khen thưởng Kỷ luật */}
            <TabPanel value={tab} index={3}>
              <SectionCard
                title="Khen thưởng & Kỷ luật"
                action={
                  <Stack direction="row" spacing={1}>
                    <Chip
                      variant="outlined"
                      size="small"
                      label={
                        (profile.awards || []).length
                          ? `${profile.awards.length} khen thưởng`
                          : "0 khen thưởng"
                      }
                    />
                    <Chip
                      variant="outlined"
                      size="small"
                      label={
                        (profile.disciplines || []).length
                          ? `${profile.disciplines.length} kỷ luật`
                          : "0 kỷ luật"
                      }
                    />
                  </Stack>
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Sẽ hiển thị bảng <code>awards</code>/
                  <code>disciplines</code>.
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
                    label={
                      profile.attendance ? "Có dữ liệu" : "Chưa có dữ liệu"
                    }
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Sẽ hiển thị bảng chấm công từ{" "}
                  <code>attendance</code>.
                </Typography>
              </SectionCard>
            </TabPanel>

            {/* TAB 5: Hồ sơ tải lên */}
            <TabPanel value={tab} index={5}>
              <SectionCard
                title="Hồ sơ tải lên"
                action={
                  <Chip
                    variant="outlined"
                    size="small"
                    label={
                      (profile.documents || []).length
                        ? `${profile.documents.length} tệp`
                        : "Chưa có dữ liệu"
                    }
                  />
                }
              >
                <Typography color="text.secondary">
                  (Khung trống) — Sẽ hiển thị danh sách file từ{" "}
                  <code>documents</code>.
                </Typography>
              </SectionCard>
            </TabPanel>
          </Box>
        </Card>
      </Container>
    </Box>
  );
}
