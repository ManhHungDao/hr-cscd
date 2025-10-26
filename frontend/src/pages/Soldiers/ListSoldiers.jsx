import { useEffect, useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TextField,
  Tooltip,
  Typography,
  useTheme,
  Container,
  Alert,
  CircularProgress,
  InputAdornment,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

/**
 * AttendanceTable.jsx (fetch từ API)
 * - Lọc theo Đơn vị (động từ unitPath) & Trạng thái
 * - Tìm kiếm theo tên / mã
 * - Nhập/Xuất CSV
 * - Bảng + Phân trang
 */

const STATUS = ["Tất cả", "Đang công tác", "Nghỉ phép", "Chuyển đơn vị"];

// Màu chip theo trạng thái
const statusToChip = (status) => {
  switch (status) {
    case "Đang công tác":
      return { color: "success", label: status };
    case "Nghỉ phép":
      return { color: "error", label: status };
    case "Chuyển đơn vị":
      return { color: "warning", label: status };
    default:
      return { color: "default", label: status };
  }
};

// Ánh xạ 1 soldier từ API -> 1 row của bảng
// THAY mapSoldierToRow cũ bằng bản này
function mapSoldierToRow(s, idx = 0) {
  return {
    id: s?._id || `tmp-${idx}`,
    code: s?.identityDocs?.policeCode || "",
    name: s?.fullName || "Chưa rõ",
    rank: s?.current?.rank || "-",
    position: s?.current?.position || "-", // 👈 lấy chức vụ
    unit: s?.unitPath || "",
    status: "Đang công tác", // tạm
    avatar:
      s?.avatar ||
      `https://i.pravatar.cc/40?u=${encodeURIComponent(s?.fullName || "")}`,
  };
}

export default function AttendanceTable() {
  const theme = useTheme();
  const [units, setUnits] = useState(["Tất cả"]); // sẽ cập nhật động
  const [unit, setUnit] = useState("Tất cả");
  const [status, setStatus] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState([]);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileRef = useRef(null);

  // Fetch dữ liệu từ API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const res = await fetch("http://localhost:4000/api/soldiers");
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json(); // mong đợi mảng như bạn gửi
        const mapped = (Array.isArray(data) ? data : []).map(mapSoldierToRow);

        if (!mounted) return;
        setRows(mapped);

        // Tạo danh sách đơn vị động từ unitPath (đầy đủ chuỗi)
        const uniq = Array.from(
          new Set(mapped.map((r) => r.unit).filter(Boolean))
        );
        setUnits(["Tất cả", ...uniq]);
        setUnit("Tất cả");
      } catch (e) {
        if (!mounted) return;
        setError("Không tải được danh sách chiến sĩ. Kiểm tra backend/CORS.");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (unit === "Tất cả" ? true : r.unit === unit) &&
        (status === "Tất cả" ? true : r.status === status) &&
        (search
          ? (r.name + r.code).toLowerCase().includes(search.toLowerCase())
          : true)
    );
  }, [rows, unit, status, search]);

  const handleToggleAll = (checked) =>
    setSelected(checked ? filtered.map((r) => r.id) : []);

  const handleToggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );

  // Xuất CSV (theo dữ liệu đã lọc)
  const handleExportCSV = () => {
    const header = [
      "Số hiệu CAND",
      "Họ tên",
      "Cấp bậc",
      "Chức vụ", // 👈 đổi tên cột
      "Đơn vị",
      "Trạng thái",
    ];

    const csv = [
      header.join(","),
      ...filtered.map((r) =>
        [r.code, r.name, r.rank, r.position, r.unit, r.status] // 👈 dùng position
          .map((v) => `"${String(v || "").replaceAll('"', '""')}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "attendance.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  // Nhập CSV (giữ nguyên như trước, thêm map status mặc định nếu thiếu)
  const handleImportCSV = async (file) => {
    if (!file) return;
    const text = await file.text();
    const lines = text.split(/\r?\n/).filter(Boolean);
    if (lines.length <= 1) return;

    const bodyLines = lines.slice(1);
    const newRows = bodyLines.map((line, idx) => {
      const cols = line
        .split(/,(?=(?:[^\"]*\"[^\"]*\")*[^\"]*$)/)
        .map((s) => s.replace(/^\"|\"$/g, "").replaceAll('""', '"'));
      return {
        id: Date.now() + idx,
        code: cols[0] || "",
        name: cols[1] || "Chưa rõ",
        rank: cols[2] || "-",
        position: cols[3] || "-", // 👈 lấy từ cột 4 của CSV
        unit: cols[4] || "",
        status: cols[5] || "Đang công tác",
        avatar: "https://i.pravatar.cc/40?img=" + (20 + (idx % 70)),
      };
    });
    setRows((prev) => [...newRows, ...prev]);

    // Cập nhật danh sách đơn vị
    const uniq = Array.from(
      new Set([...newRows, ...rows].map((r) => r.unit).filter(Boolean))
    );
    setUnits(["Tất cả", ...uniq]);
  };

  return (
    <Container maxWidth="xl" sx={{ bgcolor: "var(--color-bg)", py: 3 }}>
      <Grid justifyContent="center">
        <Grid item xs={12} md={11} lg={10}>
          <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
            <Typography variant="h5" fontWeight={700}>
              Danh sách cán bộ chiến sĩ
            </Typography>
          </Stack>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
              background: "linear-gradient(180deg,#fff,#fafafa)",
            }}
          >
            <CardContent>
              {/* Bộ lọc */}
              <Stack
                direction={{ xs: "column", sm: "row" }}
                spacing={1.5}
                alignItems={{ xs: "stretch", sm: "center" }}
                sx={{ mb: 2 }}
              >
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Đơn vị</InputLabel>
                  <Select
                    value={unit}
                    label="Đơn vị"
                    onChange={(e) => setUnit(e.target.value)}
                  >
                    {units.map((u) => (
                      <MenuItem key={u} value={u}>
                        {u}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <FormControl size="small" sx={{ minWidth: 180 }}>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select
                    value={status}
                    label="Trạng thái"
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUS.map((s) => (
                      <MenuItem key={s} value={s}>
                        {s}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <TextField
                  size="small"
                  placeholder="Tìm tên / số hiệu"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon fontSize="small" />
                      </InputAdornment>
                    ),
                  }}
                  sx={{ minWidth: 240 }}
                />

                <Box flexGrow={1} />

                <input
                  ref={fileRef}
                  type="file"
                  accept=".csv"
                  hidden
                  onChange={(e) => handleImportCSV(e.target.files?.[0])}
                />
                <ButtonGroup variant="contained">
                  <Button
                    startIcon={<FileUploadIcon />}
                    onClick={() => fileRef.current?.click()}
                  >
                    Thêm Excel
                  </Button>
                  <Button
                    startIcon={<DownloadIcon />}
                    color="inherit"
                    onClick={handleExportCSV}
                  >
                    Xuất Excel
                  </Button>
                </ButtonGroup>
              </Stack>

              {/* Loading */}
              {loading ? (
                <Stack alignItems="center" py={6}>
                  <CircularProgress />
                  <Typography variant="body2" color="text.secondary" mt={1}>
                    Đang tải dữ liệu...
                  </Typography>
                </Stack>
              ) : (
                <>
                  {/* Bảng */}
                  <TableContainer
                    sx={{
                      borderRadius: 2,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Table size="small">
                      <TableHead>
                        <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                          <TableCell width={320}>
                            Số hiệu CAND / Họ tên
                          </TableCell>
                          <TableCell width={140}>Cấp bậc</TableCell>
                          <TableCell width={180}>Chức vụ</TableCell>
                          <TableCell width={200}>Trạng thái</TableCell>
                          <TableCell align="right" width={120}>
                            Hành động
                          </TableCell>
                        </TableRow>
                      </TableHead>

                      <TableBody>
                        {filtered
                          .slice(
                            page * rowsPerPage,
                            page * rowsPerPage + rowsPerPage
                          )
                          .map((r) => (
                            <TableRow key={r.id} hover>
                              <TableCell>
                                <Stack
                                  direction="row"
                                  spacing={1.2}
                                  alignItems="center"
                                >
                                  <Avatar
                                    src={r.avatar}
                                    sx={{ width: 28, height: 28 }}
                                  />
                                  <Box>
                                    <Typography
                                      fontWeight={600}
                                      lineHeight={1.2}
                                    >
                                      {r.name}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                    >
                                      {r.code}
                                    </Typography>
                                    <Typography
                                      variant="caption"
                                      color="text.secondary"
                                      sx={{ display: "block" }}
                                    >
                                      {r.unit}
                                    </Typography>
                                  </Box>
                                </Stack>
                              </TableCell>
                              <TableCell>{r.rank || "-"}</TableCell>
                              <TableCell>{r.position || "-"}</TableCell>
                              <TableCell>
                                <Chip
                                  size="small"
                                  {...statusToChip(r.status)}
                                />
                              </TableCell>
                              <TableCell align="right">
                                <Stack
                                  direction="row"
                                  justifyContent="flex-end"
                                  spacing={0.5}
                                >
                                  <Tooltip title="Xem chi tiết">
                                    <Button size="small" variant="text">
                                      <VisibilityIcon fontSize="small" />
                                    </Button>
                                  </Tooltip>
                                  <Tooltip title="Chỉnh sửa">
                                    <Button size="small" variant="text">
                                      <EditIcon fontSize="small" />
                                    </Button>
                                  </Tooltip>
                                </Stack>
                              </TableCell>
                            </TableRow>
                          ))}
                        {filtered.length === 0 && (
                          <TableRow>
                            <TableCell colSpan={6}>
                              <Typography
                                align="center"
                                color="text.secondary"
                                py={2}
                              >
                                Không có dữ liệu phù hợp.
                              </Typography>
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>

                  <TablePagination
                    component="div"
                    count={filtered.length}
                    page={page}
                    onPageChange={(e, newPage) => setPage(newPage)}
                    rowsPerPage={rowsPerPage}
                    onRowsPerPageChange={(e) => {
                      setRowsPerPage(parseInt(e.target.value, 10));
                      setPage(0);
                    }}
                    rowsPerPageOptions={[5, 10, 20, 50]}
                  />
                </>
              )}

              {/* <Typography variant="caption" color="text.secondary">
                  * “Thêm Excel” nhập tệp .csv gồm các cột: Số hiệu CAND, Họ
                  tên, Cấp bậc, Ngày nhập ngũ, Đơn vị, Trạng thái.
                </Typography> */}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
}
