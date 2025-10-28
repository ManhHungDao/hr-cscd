// src/pages/Soldiers/WorkHistoryPage.jsx
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
  Tabs,
  Tab,
  Chip,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import PrintIcon from "@mui/icons-material/Print";

import { MOCK_WORK_HISTORY } from "@/mocks/workHistory.mock"; // đã cung cấp trước
import {
  fmtDate,
  formatDateTime,
  formatDateRange,
  truncate,
  joinNonEmpty,
} from "@/utils/format";

// -------------------- TIỆN ÍCH --------------------
const LS_KEY = "workHistory_mock_data";

// Ghép nhãn khoảng thời gian (ưu tiên formatDateRange khi có giờ:phút)
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

// -------------------- TRANG CHÍNH --------------------
export default function WorkHistoryPage({
  // soldierId để lọc dữ liệu mock theo chiến sĩ (mặc định theo dataset đã đưa)
  soldierId = "68fb8438067657a0a1e2e328",
}) {
  const [tab, setTab] = useState(0); // 0 = Bảng, 1 = Timeline
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});
  const [allItems, setAllItems] = useState([]);

  // Nạp mock từ localStorage (nếu có) hoặc từ file MOCK
  useEffect(() => {
    try {
      const raw = localStorage.getItem(LS_KEY);
      if (raw) {
        setAllItems(JSON.parse(raw) || []);
      } else {
        setAllItems(MOCK_WORK_HISTORY);
        localStorage.setItem(LS_KEY, JSON.stringify(MOCK_WORK_HISTORY));
      }
    } catch {
      setAllItems(MOCK_WORK_HISTORY);
    }
  }, []);

  // Lọc theo soldierId (mặc định đã khớp mock)
  const items = useMemo(
    () => (allItems || []).filter((x) => x.soldierId === soldierId),
    [allItems, soldierId]
  );

  // Lưu lại xuống localStorage
  const persist = (next) => {
    setAllItems(next);
    try {
      localStorage.setItem(LS_KEY, JSON.stringify(next));
    } catch {}
  };

  // Tạo ID tạm
  const genId = () => `wh_${Date.now()}`;

  // Tạo / cập nhật
  const handleSubmit = () => {
    if (!form.unitPath || !form.position || !form.from) {
      alert("Vui lòng nhập tối thiểu: Đơn vị, Chức vụ, Từ ngày/giờ");
      return;
    }

    if (form._id) {
      // update
      const next = allItems.map((x) =>
        x._id === form._id ? { ...x, ...form } : x
      );
      persist(next);
    } else {
      // create
      const newItem = {
        ...form,
        _id: genId(),
        soldierId,
      };
      persist([newItem, ...allItems]);
    }

    setOpen(false);
    setForm({});
  };

  // Xoá
  const handleDelete = (id) => {
    const next = allItems.filter((x) => x._id !== id);
    persist(next);
  };

  // Xuất PDF (mở cửa sổ in -> chọn Save as PDF)
  const exportPDF = () => {
    const rows = (items || [])
      .map(
        (it) => `
        <tr>
          <td>${buildRangeLabel(it.from, it.to)}</td>
          <td>${it.unitPath || ""}</td>
          <td>${it.position || ""}</td>
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
        <title>Quá trình công tác</title>
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
        <h1>Quá trình công tác</h1>
        <div class="meta">Xuất lúc: ${formatDateTime(
          new Date().toISOString()
        )}</div>
        <table>
          <thead>
            <tr>
              <th>Thời gian</th>
              <th>Đơn vị</th>
              <th>Chức vụ</th>
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
          <Stack direction="row" justifyContent="flex-end" spacing={1}>
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
                setForm({});
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
                <TableCell>Thời gian</TableCell>
                <TableCell>Đơn vị</TableCell>
                <TableCell>Chức vụ</TableCell>
                <TableCell>Quyết định</TableCell>
                <TableCell>Ghi chú</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(items || []).map((it) => (
                <TableRow key={it._id}>
                  <TableCell>{buildRangeLabel(it.from, it.to)}</TableCell>
                  <TableCell>{it.unitPath}</TableCell>
                  <TableCell>{it.position}</TableCell>
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
                    colSpan={6}
                    sx={{ color: "text.secondary", fontStyle: "italic" }}
                  >
                    Chưa có dữ liệu quá trình công tác.
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
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {form._id ? "Cập nhật" : "Thêm mới"} quá trình công tác
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} mt={1}>
              <TextField
                label="Đơn vị"
                value={form.unitPath || ""}
                onChange={(e) => setForm({ ...form, unitPath: e.target.value })}
              />
              <TextField
                label="Chức vụ"
                value={form.position || ""}
                onChange={(e) => setForm({ ...form, position: e.target.value })}
              />
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
              />
              <TextField
                label="Số quyết định"
                value={form.decisionNo || ""}
                onChange={(e) =>
                  setForm({ ...form, decisionNo: e.target.value })
                }
              />
              <TextField
                label="Ngày quyết định"
                type="date"
                value={form.decisionDate ? form.decisionDate.slice(0, 10) : ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    decisionDate: e.target.value
                      ? new Date(e.target.value).toISOString()
                      : "",
                  })
                }
                InputLabelProps={{ shrink: true }}
              />
              <TextField
                label="Ghi chú"
                multiline
                minRows={2}
                value={form.note || ""}
                onChange={(e) => setForm({ ...form, note: e.target.value })}
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
