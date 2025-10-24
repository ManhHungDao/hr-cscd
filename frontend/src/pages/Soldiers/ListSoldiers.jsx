import { useMemo, useRef, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  Chip,
  Divider,
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
} from "@mui/material";
import Grid from "@mui/material/Grid";
import DownloadIcon from "@mui/icons-material/Download";
import FileUploadIcon from "@mui/icons-material/FileUpload";
import VisibilityIcon from "@mui/icons-material/Visibility";
import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";

/**
 * AttendanceTable.jsx
 * Trang riêng “/attendance” hiển thị bảng danh sách cán bộ, có lọc, chip trạng thái,
 * nút nhập/xuất Excel (CSV), chọn nhiều dòng. Không dùng @mui/lab.
 */

// ---- DỮ LIỆU ẢO ----
const UNITS = ["Tiểu đoàn 1", "Tiểu đoàn 2", "Tiểu đoàn 3"];
const STATUS = ["Tất cả", "Đang công tác", "Nghỉ phép", "Chuyển đơn vị"];

const MOCK_ROWS = [
  {
    id: 1,
    code: "SH-0001",
    name: "Trung sĩ Nguyễn Văn A",
    rank: "Trung sĩ",
    enlistedAt: "2019-08-01",
    unit: UNITS[0],
    status: "Đang công tác",
    avatar: "https://i.pravatar.cc/40?img=11",
  },
  {
    id: 2,
    code: "SH-0002",
    name: "Trung sĩ Lê Thị B",
    rank: "Trung sĩ",
    enlistedAt: "2020-03-10",
    unit: UNITS[0],
    status: "Nghỉ phép",
    avatar: "https://i.pravatar.cc/40?img=12",
  },
  {
    id: 3,
    code: "SH-0003",
    name: "Thiếu úy Trần Văn Quyết",
    rank: "Thiếu úy",
    enlistedAt: "2018-01-20",
    unit: UNITS[1],
    status: "Đang công tác",
    avatar: "https://i.pravatar.cc/40?img=13",
  },
  {
    id: 4,
    code: "SH-0004",
    name: "Thượng úy Lê Thị B",
    rank: "Thượng úy",
    enlistedAt: "2017-10-05",
    unit: UNITS[2],
    status: "Chuyển đơn vị",
    avatar: "https://i.pravatar.cc/40?img=14",
  },
  {
    id: 5,
    code: "SH-0005",
    name: "Trung úy Năn Quyết I",
    rank: "Trung úy",
    enlistedAt: "2018-12-12",
    unit: UNITS[1],
    status: "Đang công tác",
    avatar: "https://i.pravatar.cc/40?img=15",
  },
  {
    id: 6,
    code: "SH-0006",
    name: "Thiếu tá Trần Văn Đạt",
    rank: "Thiếu tá",
    enlistedAt: "2015-04-22",
    unit: UNITS[2],
    status: "Nghỉ phép",
    avatar: "https://i.pravatar.cc/40?img=16",
  },
];

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

export default function AttendanceTable() {
  const theme = useTheme();
  const [unit, setUnit] = useState(UNITS[0]);
  const [status, setStatus] = useState("Tất cả");
  const [search, setSearch] = useState("");
  const [rows, setRows] = useState(MOCK_ROWS);
  const [selected, setSelected] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const fileRef = useRef(null);

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return rows.filter(
      (r) =>
        (unit ? r.unit === unit : true) &&
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

  // Xuất CSV
  const handleExportCSV = () => {
    const header = [
      "Số hiệu CAND",
      "Họ tên",
      "Cấp bậc",
      "Ngày nhập ngũ",
      "Đơn vị",
      "Trạng thái",
    ];
    const csv = [
      header.join(","),
      ...filtered.map((r) =>
        [r.code, r.name, r.rank, r.enlistedAt, r.unit, r.status]
          .map((v) => `"${String(v).replaceAll('"', '""')}"`)
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

  // Nhập CSV
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
        code: cols[0] || `SH-X${idx}`,
        name: cols[1] || "Chưa rõ",
        rank: cols[2] || "-",
        enlistedAt: cols[3] || "",
        unit: cols[4] || UNITS[0],
        status: cols[5] || "Đang công tác",
        avatar: "https://i.pravatar.cc/40?img=" + (20 + (idx % 70)),
      };
    });
    setRows((prev) => [...newRows, ...prev]);
  };

  return (
    <Box sx={{ bgcolor: "var(--color-bg)", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Grid justifyContent="center">
          <Grid item xs={12} md={11} lg={10}>
            <Stack direction="row" alignItems="center" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="h5" fontWeight={700}>
                  Danh sách cán bộ chiến sĩ
                </Typography>
              </Box>
            </Stack>
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
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Đơn vị</InputLabel>
                    <Select
                      value={unit}
                      label="Đơn vị"
                      onChange={(e) => setUnit(e.target.value)}
                    >
                      {UNITS.map((u) => (
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
                        <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{ minWidth: 220 }}
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
                        <TableCell width={280}>Số hiệu CAND / Họ tên</TableCell>
                        <TableCell width={120}>Cấp bậc</TableCell>
                        <TableCell width={160}>Ngày nhập ngũ</TableCell>
                        <TableCell width={160}>Trạng thái</TableCell>
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
                                  <Typography fontWeight={600} lineHeight={1.2}>
                                    {r.name}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {r.code}
                                  </Typography>
                                </Box>
                              </Stack>
                            </TableCell>
                            <TableCell>{r.rank || "-"}</TableCell>
                            <TableCell>
                              {new Date(r.enlistedAt).toLocaleDateString(
                                "vi-VN"
                              )}
                            </TableCell>
                            <TableCell>
                              <Chip size="small" {...statusToChip(r.status)} />
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

                <Typography variant="caption" color="text.secondary">
                  * “Thêm Excel” nhập tệp .csv gồm các cột: Số hiệu CAND, Họ
                  tên, Cấp bậc, Ngày nhập ngũ, Đơn vị, Trạng thái.
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
