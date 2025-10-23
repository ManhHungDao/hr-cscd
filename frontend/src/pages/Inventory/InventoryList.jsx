import { useMemo, useState } from "react";
import {
  Box,
  Button,
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
  Typography,
  useTheme,
  Container,
  Tooltip,
  Paper,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import SecurityIcon from "@mui/icons-material/Security";

import { getAllInventory } from "@/store/inventoryStore";
import { useNavigate } from "react-router-dom";
import EllipsisCell from "@/components/EllipsisCell";

// Khai báo cột: key / nhãn / độ rộng / align
const TABLE_HEADERS = [
  { label: "Mã / Tên", key: "name", width: 280 },
  { label: "Loại", key: "category", width: 120 },
  { label: "Số lượng", key: "quantity", width: 100, align: "right" },
  { label: "Đơn vị", key: "unit", width: 110 },
  { label: "Tình trạng", key: "status", width: 150 },
  { label: "Ngày nhập", key: "receivedAt", width: 160 },
  { label: "Ghi chú", key: "note", width: 260 },
];

const CATEGORY_OPTIONS = [
  { value: "all", label: "Tất cả loại" },
  { value: "vukhi", label: "Vũ khí quân dụng" },
  { value: "dungcu", label: "Dụng cụ" },
  { value: "trangbi", label: "Trang thiết bị" },
];

const STATUS_OPTIONS = [
  { value: "all", label: "Tất cả trạng thái" },
  { value: "đạt", label: "Đạt" },
  { value: "bảo dưỡng", label: "Bảo dưỡng" },
  { value: "hỏng", label: "Hỏng" },
];

const categoryIcon = (cat) => {
  switch (cat) {
    case "vukhi":
      return <SecurityIcon fontSize="small" />;
    case "dungcu":
      return <HomeRepairServiceIcon fontSize="small" />;
    case "trangbi":
      return <Inventory2Icon fontSize="small" />;
    default:
      return <Inventory2Icon fontSize="small" />;
  }
};

const statusToChip = (status) => {
  switch (status) {
    case "đạt":
      return { color: "success", label: "Đạt", variant: "outlined" };
    case "bảo dưỡng":
      return { color: "warning", label: "Bảo dưỡng", variant: "outlined" };
    case "hỏng":
      return { color: "error", label: "Hỏng", variant: "outlined" };
    default:
      return { color: "default", label: status };
  }
};

export default function InventoryList() {
  const theme = useTheme();
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);
  const navigate = useNavigate();

  // Lấy dữ liệu kho
  const rows = useMemo(() => getAllInventory(), []);

  // Lọc dữ liệu
  const filtered = useMemo(() => {
    return rows.filter((r) => {
      const matchCat = category === "all" ? true : r.category === category;
      const matchStatus =
        status === "all"
          ? true
          : (r.status || "").toLowerCase() === status.toLowerCase();
      const q = search.trim().toLowerCase();
      const matchSearch = !q
        ? true
        : [r.code, r.name, r.unit, r.note]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(q));
      return matchCat && matchStatus && matchSearch;
    });
  }, [rows, category, status, search]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  return (
    <Box sx={{ bgcolor: "var(--color-bg)", minHeight: "100vh", py: 3 }}>
      <Container maxWidth="xl">
        <Grid justifyContent="center">
          <Grid item xs={12} md={11} lg={10}>
            <Stack
              direction={{ xs: "column", sm: "row" }}
              alignItems={{ xs: "flex-start", sm: "center" }}
              justifyContent="space-between"
              spacing={2}
              sx={{ mb: 2 }}
            >
              <Typography variant="h5" fontWeight={700}>
                Danh sách trang bị trong kho
              </Typography>
              <Button
                variant="contained"
                onClick={() => navigate("/inventory/manage")}
              >
                Quản lý kho
              </Button>
            </Stack>

            <Card
              elevation={0}
              sx={{
                borderRadius: 3,
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                background: "linear-gradient(180deg,#fff,#fafafa)",
              }}
            >
              <Divider />
              <CardContent>
                {/* Bộ lọc */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={1.5}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ mb: 2 }}
                >
                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Loại</InputLabel>
                    <Select
                      value={category}
                      label="Loại"
                      onChange={(e) => {
                        setCategory(e.target.value);
                        setPage(0);
                      }}
                    >
                      {CATEGORY_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 200 }}>
                    <InputLabel>Trạng thái</InputLabel>
                    <Select
                      value={status}
                      label="Trạng thái"
                      onChange={(e) => {
                        setStatus(e.target.value);
                        setPage(0);
                      }}
                    >
                      {STATUS_OPTIONS.map((o) => (
                        <MenuItem key={o.value} value={o.value}>
                          {o.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <TextField
                    size="small"
                    placeholder="Tìm mã / tên / ghi chú"
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setPage(0);
                    }}
                    InputProps={{
                      startAdornment: (
                        <SearchIcon fontSize="small" sx={{ mr: 1 }} />
                      ),
                    }}
                    sx={{ minWidth: 260 }}
                  />

                  <Box flexGrow={1} />
                </Stack>

                {/* Bảng */}
                <TableContainer
                  component={Paper}
                  sx={{
                    borderRadius: 2,
                    border: `1px solid ${theme.palette.divider}`,
                  }}
                >
                  <Table size="small" sx={{ tableLayout: "fixed" }}>
                    <TableHead>
                      <TableRow sx={{ bgcolor: theme.palette.grey[50] }}>
                        {TABLE_HEADERS.map((col) => (
                          <TableCell
                            key={col.key}
                            width={col.width}
                            align={col.align || "left"}
                            sx={{
                              width: col.width,
                              maxWidth: col.width,
                              overflow: "hidden",
                            }}
                          >
                            {col.label}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>

                    <TableBody>
                      {paged.map((r) => (
                        <TableRow key={r.id} hover>
                          {TABLE_HEADERS.map((col) => {
                            const value = (() => {
                              switch (col.key) {
                                case "name":
                                  return (
                                    <Stack
                                      direction="row"
                                      spacing={1.2}
                                      alignItems="center"
                                      sx={{ minWidth: 0 }}
                                    >
                                      {/* (tuỳ chọn) icon theo loại */}
                                      <Box sx={{ minWidth: 0 }}>
                                        <EllipsisCell
                                          text={r.name}
                                          width={col.width}
                                        />
                                        <Typography
                                          variant="caption"
                                          color="text.secondary"
                                        >
                                          {r.code}
                                        </Typography>
                                      </Box>
                                    </Stack>
                                  );
                                case "category":
                                  return (
                                    <EllipsisCell
                                      text={
                                        CATEGORY_OPTIONS.find(
                                          (o) => o.value === r.category
                                        )?.label || r.category
                                      }
                                      width={col.width}
                                      align={col.align}
                                    />
                                  );
                                case "quantity":
                                  return (
                                    <Typography align="right">
                                      {r.quantity}
                                    </Typography>
                                  );
                                case "unit":
                                  return (
                                    <EllipsisCell
                                      text={r.unit}
                                      width={col.width}
                                      align={col.align}
                                    />
                                  );
                                case "status":
                                  return (
                                    <Chip
                                      size="small"
                                      {...statusToChip(r.status)}
                                    />
                                  );
                                case "receivedAt":
                                  return (
                                    <EllipsisCell
                                      text={
                                        r.receivedAt
                                          ? new Date(
                                              r.receivedAt
                                            ).toLocaleDateString("vi-VN")
                                          : "-"
                                      }
                                      width={col.width}
                                      align={col.align}
                                    />
                                  );
                                case "note":
                                  return (
                                    <EllipsisCell
                                      text={r.note}
                                      width={col.width}
                                      align={col.align}
                                    />
                                  );
                                default:
                                  return (
                                    <EllipsisCell text="" width={col.width} />
                                  );
                              }
                            })();

                            return (
                              <TableCell
                                key={`${r.id}-${col.key}`}
                                align={col.align || "left"}
                                sx={{
                                  width: col.width,
                                  maxWidth: col.width,
                                  overflow: "hidden",
                                  "& *": { minWidth: 0 },
                                }}
                              >
                                {value}
                              </TableCell>
                            );
                          })}
                        </TableRow>
                      ))}

                      {filtered.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={TABLE_HEADERS.length}>
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
                  rowsPerPageOptions={[7, 15, 25, 50]}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
