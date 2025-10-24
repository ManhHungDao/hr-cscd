import { useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  FormControl,
  InputAdornment,
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
  Paper,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import HomeRepairServiceIcon from "@mui/icons-material/HomeRepairService";
import SecurityIcon from "@mui/icons-material/Security";

import {
  getAllInventory,
  addInventory,
  updateInventory,
  deleteInventory,
} from "@/store/inventoryStore";
import EllipsisCell from "@/components/EllipsisCell";

const TABLE_HEADERS = [
  { label: "Mã / Tên", key: "name", width: 280 },
  { label: "Loại", key: "category", width: 120 },
  { label: "Số lượng", key: "quantity", width: 100, align: "right" },
  { label: "Đơn vị", key: "unit", width: 110 },
  { label: "Tình trạng", key: "status", width: 130 },
  { label: "Ngày nhập", key: "receivedAt", width: 120 },
  { label: "Ghi chú", key: "note", width: 230 },
  { label: "Hành động", key: "actions", width: 110, align: "right" },
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

const statusToChip = (s) => {
  switch (s) {
    case "đạt":
      return { color: "success", label: "Đạt", variant: "variant" };
    case "bảo dưỡng":
      return { color: "warning", label: "Bảo dưỡng", variant: "variant" };
    case "hỏng":
      return { color: "error", label: "Hỏng", variant: "variant" };
    default:
      return { color: "default", label: s };
  }
};

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

function ItemDialog({ open, onClose, initial }) {
  const [form, setForm] = useState(
    initial || {
      code: "",
      name: "",
      category: "vukhi",
      quantity: 1,
      unit: "",
      status: "đạt",
      serialsText: "",
      receivedAt: "",
      note: "",
    }
  );
  const set = (k, v) => setForm((s) => ({ ...s, [k]: v }));

  const onSubmit = () => {
    const serials = (form.serialsText || "")
      .split(/[\n,]+/)
      .map((x) => x.trim())
      .filter(Boolean);
    onClose({
      code: form.code,
      name: form.name,
      category: form.category,
      quantity: Number(form.quantity) || 0,
      unit: form.unit,
      status: form.status,
      serials,
      receivedAt: form.receivedAt,
      note: form.note,
    });
  };

  return (
    <Dialog open={open} onClose={() => onClose(null)} maxWidth="md" fullWidth>
      <DialogTitle>{initial ? "Sửa mục kho" : "Thêm mục kho"}</DialogTitle>
      <DialogContent dividers>
        <Grid container spacing={2}>
          <Grid item xs={12} md={4}>
            <TextField
              label="Mã"
              value={form.code}
              onChange={(e) => set("code", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <TextField
              label="Tên"
              value={form.name}
              onChange={(e) => set("name", e.target.value)}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Loại"
              value={form.category}
              onChange={(e) => set("category", e.target.value)}
              fullWidth
            >
              {CATEGORY_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="number"
              inputProps={{ min: 0 }}
              label="Số lượng"
              value={form.quantity}
              onChange={(e) => set("quantity", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Đơn vị"
              value={form.unit}
              onChange={(e) => set("unit", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              select
              label="Tình trạng"
              value={form.status}
              onChange={(e) => set("status", e.target.value)}
              fullWidth
            >
              {STATUS_OPTIONS.filter((o) => o.value !== "all").map((o) => (
                <MenuItem key={o.value} value={o.value}>
                  {o.label}
                </MenuItem>
              ))}
            </TextField>
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              type="date"
              label="Ngày nhập"
              InputLabelProps={{ shrink: true }}
              value={form.receivedAt}
              onChange={(e) => set("receivedAt", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={4}>
            <TextField
              label="Ghi chú"
              value={form.note}
              onChange={(e) => set("note", e.target.value)}
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Số sê-ri (mỗi dòng hoặc dấu phẩy)"
              value={form.serialsText}
              onChange={(e) => set("serialsText", e.target.value)}
              fullWidth
              multiline
              minRows={3}
            />
          </Grid>
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(null)}>Hủy</Button>
        <Button variant="contained" onClick={onSubmit}>
          {initial ? "Lưu" : "Thêm"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default function InventoryManage() {
  const navigate = useNavigate();

  const [rows, setRows] = useState(getAllInventory());
  const [dlg, setDlg] = useState({ open: false, initial: null });
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");
  const [stt, setStt] = useState("all");
  const [selected, setSelected] = useState([]);
  const fileRef = useRef(null);

  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(7);

  const reload = () => setRows(getAllInventory());

  const onAdd = () => setDlg({ open: true, initial: null });
  const onEdit = (r) => setDlg({ open: true, initial: r });
  const onDeleteRow = (r) => {
    deleteInventory(r.id);
    reload();
  };
  const onClose = (payload) => {
    const init = dlg.initial;
    setDlg({ open: false, initial: null });
    if (!payload) return;
    if (init) updateInventory(init.id, payload);
    else addInventory(payload);
    reload();
  };

  const filtered = useMemo(() => {
    const list = getAllInventory();
    return list.filter((it) => {
      const okCat = cat === "all" ? true : it.category === cat;
      const okStt =
        stt === "all"
          ? true
          : (it.status || "").toLowerCase() === stt.toLowerCase();
      const s = q.trim().toLowerCase();
      const okSearch = !s
        ? true
        : [it.code, it.name, it.unit, it.note]
            .filter(Boolean)
            .some((v) => String(v).toLowerCase().includes(s));
      return okCat && okStt && okSearch;
    });
  }, [rows, q, cat, stt]);

  const paged = useMemo(
    () => filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage),
    [filtered, page, rowsPerPage]
  );

  const toggleAll = (checked) =>
    setSelected(checked ? filtered.map((r) => r.id) : []);
  const toggleOne = (id) =>
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  const bulkDelete = () => {
    if (selected.length === 0) return;
    selected.forEach((id) => deleteInventory(id));
    setSelected([]);
    reload();
  };

  const onChangeFilter = (setter) => (e) => {
    setter(e.target.value);
    setPage(0);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      {/* Header */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton color="inherit" size="small" onClick={() => navigate(-1)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h5" fontWeight={700}>
            Quản lý kho
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Button variant="contained" onClick={onAdd}>
            Thêm
          </Button>
        </Stack>
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
              <InputLabel>Loại</InputLabel>
              <Select
                value={cat}
                label="Loại"
                onChange={onChangeFilter(setCat)}
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
                value={stt}
                label="Trạng thái"
                onChange={onChangeFilter(setStt)}
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
              value={q}
              onChange={(e) => {
                setQ(e.target.value);
                setPage(0);
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{ minWidth: 260 }}
            />

            <Box flexGrow={1} />
          </Stack>

          {/* Bảng */}
          <TableContainer component={Paper} sx={{ borderRadius: 2 }}>
            <Table size="small" sx={{ tableLayout: "fixed" }}>
              <TableHead>
                <TableRow>
                  {TABLE_HEADERS.map((col) => (
                    <TableCell
                      key={col.label}
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
                                {/* icon theo loại (tuỳ chọn) */}
                                {/* {categoryIcon(r.category)} */}
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
                          case "status":
                            return (
                              <Chip size="small" {...statusToChip(r.status)} />
                            );
                          case "actions":
                            return (
                              <>
                                <Tooltip title="Sửa">
                                  <IconButton
                                    size="small"
                                    onClick={() => onEdit(r)}
                                  >
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Xóa">
                                  <IconButton
                                    size="small"
                                    onClick={() => onDeleteRow(r)}
                                  >
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            );
                          default:
                            return (
                              <EllipsisCell
                                text={r[col.key]}
                                width={col.width}
                                align={col.align}
                              />
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
                    <TableCell colSpan={TABLE_HEADERS.length} align="center">
                      Không có dữ liệu phù hợp.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* Phân trang */}
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

      <ItemDialog open={dlg.open} onClose={onClose} initial={dlg.initial} />
    </Container>
  );
}
