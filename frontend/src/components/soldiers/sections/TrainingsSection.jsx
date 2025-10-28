// src/pages/Soldiers/TrainingPage.jsx
import {
  Box,
  Button,
  Card,
  CardContent,
  Stack,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";

import { MOCK_TRAINING, TRAINING_TYPES } from "@/mocks/training.mock";
import {
  fmtDate,
  formatDateTime,
  formatDateRange,
  truncate,
  joinNonEmpty,
} from "@/utils/format";

// -------------------- TIỆN ÍCH --------------------
const LS_KEY = "training_mock_data";

function buildRangeLabel(from, to) {
  const hasTime =
    (from && !from.endsWith("T00:00:00.000Z")) ||
    (to && !to.endsWith("T00:00:00.000Z"));
  if (from && to) {
    return hasTime
      ? formatDateRange(from, to)
      : `${fmtDate(from)} → ${fmtDate(to)}`;
  }
  if (from && !to) {
    return hasTime
      ? `${formatDateTime(from)} → Hiện tại`
      : `${fmtDate(from)} → Hiện tại`;
  }
  return "—";
}

const TYPE_LABEL = (v) =>
  TRAINING_TYPES.find((t) => t.value === v)?.label || "—";

// -------------------- TRANG CHÍNH --------------------
export default function TrainingPage({
  soldierId = "68fb8438067657a0a1e2e328",
}) {
  const [tab, setTab] = useState(0); // 0 = Bảng, 1 = Timeline
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [allItems, setAllItems] = useState([]);
  const [typeFilter, setTypeFilter] = useState("all"); // all | training | drill

  // Nạp mock từ localStorage (nếu có) hoặc từ file MOCK
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setAllItems(JSON.parse(raw) || []);
      } else {
        setAllItems(MOCK_TRAINING);
        localStorage.setItem(LS_KEY, JSON.stringify(MOCK_TRAINING));
      }
    } catch {
      setAllItems(MOCK_TRAINING);
    }
  }, []);

  // Lọc theo soldierId + loại
  const items = useMemo(() => {
    let list = (allItems || []).filter((x) => x.soldierId === soldierId);
    if (typeFilter !== "all") {
      list = list.filter((x) => x.type === typeFilter);
    }
    return list;
  }, [allItems, soldierId, typeFilter]);

  const persist = (next) => {
    setAllItems(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  const genId = () => `tr_${Date.now()}`;

  const handleSubmit = () => {
    if (!form.courseName || !form.type || !form.from) {
      alert("Vui lòng nhập tối thiểu: Loại, Tên khoá, Thời gian bắt đầu");
      return;
    }
    if (form._id) {
      const next = allItems.map((x) =>
        x._id === form._id ? { ...x, ...form } : x
      );
      persist(next);
    } else {
      const newItem = { ...form, _id: genId(), soldierId };
      persist([newItem, ...allItems]);
    }
    setOpen(false);
    setForm({});
  };

  const handleDelete = (id) => {
    const next = allItems.filter((x) => x._id !== id);
    persist(next);
  };

  // Xuất PDF (mở cửa sổ in -> Save as PDF)
  const exportPDF = () => {
    const rows = (items || [])
      .map(
        (it) => `
        <tr>
          <td>${TYPE_LABEL(it.type)}</td>
          <td>${it.courseName || ""}</td>
          <td>${joinNonEmpty([it.provider, it.location], " • ")}</td>
          <td>${buildRangeLabel(it.from, it.to)}</td>
          <td>${it.hours ?? ""}</td>
          <td>${joinNonEmpty(
            [
              it.certificate,
              it.score != null ? `Điểm: ${it.score}` : "",
              it.result,
            ],
            " • "
          )}</td>
          <td>${joinNonEmpty(
            [it.decisionNo, it.decisionDate ? fmtDate(it.decisionDate) : ""],
            " • "
          )}</td>
          <td>${it.note ? it.note.replace(/</g, "&lt;") : ""}</td>
        </tr>`
      )
      .join("");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>Đào tạo & Huấn luyện</title>
        <style>
          body { font-family: Arial, sans-serif; padding: 24px; }
          h1 { font-size: 18px; margin: 0 0 16px; }
          table { border-collapse: collapse; width: 100%; font-size: 12px; }
          th, td { border: 1px solid #ddd; padding: 8px; vertical-align: top; }
          th { background: #f5f5f5; text-align: left; }
          .meta { margin-bottom: 12px; color: #666; font-size: 12px; }
          @page { size: A4; margin: 16mm; }
        </style>
      </head>
      <body>
        <h1>Đào tạo & Huấn luyện</h1>
        <div class="meta">Xuất lúc: ${formatDateTime(
          new Date().toISOString()
        )} — Lọc: ${
      typeFilter === "all" ? "Tất cả" : TYPE_LABEL(typeFilter)
    }</div>
        <table>
          <thead>
            <tr>
              <th>Loại</th>
              <th>Khoá</th>
              <th>Đơn vị/Địa điểm</th>
              <th>Thời gian</th>
              <th>Giờ</th>
              <th>Kết quả</th>
              <th>Quyết định</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
        </table>
        <script>
          window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  return (
    <Card>
      <CardContent>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Stack direction="row" spacing={1}>
            <ToggleButtonGroup
              size="small"
              value={typeFilter}
              exclusive
              onChange={(_, v) => setTypeFilter(v || "all")}
            >
              <ToggleButton sx={{ px: 1 }} value="all">
                Tất cả
              </ToggleButton>
              <ToggleButton sx={{ px: 1 }} value="training">
                Đào tạo
              </ToggleButton>
              <ToggleButton sx={{ px: 1 }} value="drill">
                Huấn luyện
              </ToggleButton>
            </ToggleButtonGroup>
            <Button
              startIcon={<PrintIcon />}
              variant="outlined"
              onClick={exportPDF}
            >
              Xuất PDF
            </Button>
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              onClick={() => {
                setForm({ type: "training" });
                setOpen(true);
              }}
            >
              Thêm mới
            </Button>
          </Stack>
        </Stack>

        {/* Dạng bảng */}
        {tab === 0 && (
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Loại</TableCell>
                <TableCell>Khoá</TableCell>
                <TableCell>Đơn vị/Địa điểm</TableCell>
                <TableCell>Thời gian</TableCell>
                <TableCell>Giờ</TableCell>
                <TableCell>Kết quả</TableCell>
                <TableCell>Quyết định</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((it) => (
                <TableRow key={it._id}>
                  <TableCell>{TYPE_LABEL(it.type)}</TableCell>
                  <TableCell>{it.courseName}</TableCell>
                  <TableCell>
                    {joinNonEmpty([it.provider, it.location], " • ")}
                  </TableCell>
                  <TableCell>{buildRangeLabel(it.from, it.to)}</TableCell>
                  <TableCell>{it.hours ?? ""}</TableCell>
                  <TableCell>
                    {joinNonEmpty(
                      [
                        it.certificate,
                        it.score != null ? `Điểm: ${it.score}` : "",
                        it.result,
                      ],
                      " • "
                    )}
                  </TableCell>
                  <TableCell>
                    {joinNonEmpty(
                      [
                        it.decisionNo,
                        it.decisionDate ? fmtDate(it.decisionDate) : "",
                      ],
                      " • "
                    )}
                  </TableCell>
                  <TableCell>{truncate(it.note, 100)}</TableCell>
                  <TableCell align="right">
                    <IconButton
                      color="primary"
                      onClick={() => {
                        setForm(it);
                        setOpen(true);
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => handleDelete(it._id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {items.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={9}
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    Chưa có mục Đào tạo/Huấn luyện phù hợp bộ lọc.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}

        {/* Dialog thêm/sửa */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {form._id ? "Cập nhật" : "Thêm mới"} đào tạo/huấn luyện
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <FormControl fullWidth>
                <InputLabel>Loại</InputLabel>
                <Select
                  label="Loại"
                  value={form.type || ""}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                >
                  {TRAINING_TYPES.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Tên khoá"
                value={form.courseName || ""}
                onChange={(e) =>
                  setForm({ ...form, courseName: e.target.value })
                }
                fullWidth
              />
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Đơn vị tổ chức"
                  value={form.provider || ""}
                  onChange={(e) =>
                    setForm({ ...form, provider: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Địa điểm"
                  value={form.location || ""}
                  onChange={(e) =>
                    setForm({ ...form, location: e.target.value })
                  }
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Từ (ISO - datetime)"
                  type="datetime-local"
                  value={form.from ? form.from.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      from: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Đến (ISO - datetime)"
                  type="datetime-local"
                  value={form.to ? form.to.slice(0, 16) : ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      to: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
                <TextField
                  label="Giờ (số)"
                  type="number"
                  value={form.hours ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      hours: e.target.value ? Number(e.target.value) : null,
                    })
                  }
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Chứng chỉ"
                  value={form.certificate || ""}
                  onChange={(e) =>
                    setForm({ ...form, certificate: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Điểm"
                  type="number"
                  value={form.score ?? ""}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      score:
                        e.target.value === "" ? null : Number(e.target.value),
                    })
                  }
                  fullWidth
                />
                <TextField
                  label="Kết quả"
                  value={form.result || ""}
                  onChange={(e) => setForm({ ...form, result: e.target.value })}
                  fullWidth
                />
              </Stack>

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Số quyết định"
                  value={form.decisionNo || ""}
                  onChange={(e) =>
                    setForm({ ...form, decisionNo: e.target.value })
                  }
                  fullWidth
                />
                <TextField
                  label="Ngày quyết định"
                  type="date"
                  value={
                    form.decisionDate ? form.decisionDate.slice(0, 10) : ""
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      decisionDate: e.target.value
                        ? new Date(e.target.value).toISOString()
                        : "",
                    })
                  }
                  InputLabelProps={{ shrink: true }}
                  fullWidth
                />
              </Stack>

              <TextField
                label="Ghi chú"
                multiline
                minRows={2}
                value={form.note || ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
                fullWidth
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit}>
              Lưu
            </Button>
          </DialogActions>
        </Dialog>
      </CardContent>
    </Card>
  );
}
