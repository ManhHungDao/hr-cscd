// src/pages/Soldiers/AwardsDisciplinePage.jsx
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

import {
  AWARD_TYPES,
  DISCIPLINE_TYPES,
  MOCK_AWARDS,
  MOCK_DISCIPLINES,
} from "@/mocks/rewards.mock";

import {
  fmtDate,
  formatDateTime,
  joinNonEmpty,
  truncate,
} from "@/utils/format";

// -------------------- TIỆN ÍCH --------------------
const LS_KEY_AW = "awards_mock_data";
const LS_KEY_DL = "disciplines_mock_data";

const findLabel = (list, v) => list.find((t) => t.value === v)?.label || "—";
const getYear = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  return Number.isNaN(d.getTime()) ? "" : d.getFullYear();
};

// -------------------- TRANG CHÍNH --------------------
export default function AwardsDisciplinePage({
  soldierId = "68fb8438067657a0a1e2e328",
}) {
  const [tab, setTab] = useState(0); // 0 = Khen thưởng, 1 = Kỷ luật
  const [awards, setAwards] = useState([]);
  const [disciplines, setDisciplines] = useState([]);

  // Lọc
  const [awardType, setAwardType] = useState("all");
  const [disciplineType, setDisciplineType] = useState("all");
  const [yearFilter, setYearFilter] = useState("all");

  // Form
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({});

  // Nạp dữ liệu từ localStorage hoặc mock
  useEffect(() => {
    try {
      const aw = localStorage.getItem(LS_KEY_AW);
      setAwards(aw ? JSON.parse(aw) : MOCK_AWARDS);
    } catch {
      setAwards(MOCK_AWARDS);
    }
    try {
      const dl = localStorage.getItem(LS_KEY_DL);
      setDisciplines(dl ? JSON.parse(dl) : MOCK_DISCIPLINES);
    } catch {
      setDisciplines(MOCK_DISCIPLINES);
    }
  }, []);

  // Tạo danh sách năm để lọc (ghép từ cả 2 bảng)
  const YEAR_OPTIONS = useMemo(() => {
    const years = new Set();
    [...awards, ...disciplines].forEach((x) => {
      const y = getYear(x.decisionDate);
      if (y) years.add(y);
    });
    return ["all", ...Array.from(years).sort((a, b) => b - a)];
  }, [awards, disciplines]);

  // Lưu localStorage
  const persistAwards = (next) => {
    setAwards(next);
    try {
      localStorage.setItem(LS_KEY_AW, JSON.stringify(next));
    } catch {}
  };
  const persistDisciplines = (next) => {
    setDisciplines(next);
    try {
      localStorage.setItem(LS_KEY_DL, JSON.stringify(next));
    } catch {}
  };

  const genId = (prefix) => `${prefix}_${Date.now()}`;

  // Dữ liệu đã lọc
  const filteredAwards = useMemo(() => {
    return (awards || [])
      .filter((x) => x.soldierId === soldierId)
      .filter((x) => (awardType === "all" ? true : x.type === awardType))
      .filter((x) =>
        yearFilter === "all"
          ? true
          : getYear(x.decisionDate) === Number(yearFilter)
      );
  }, [awards, soldierId, awardType, yearFilter]);

  const filteredDisciplines = useMemo(() => {
    return (disciplines || [])
      .filter((x) => x.soldierId === soldierId)
      .filter((x) =>
        disciplineType === "all" ? true : x.type === disciplineType
      )
      .filter((x) =>
        yearFilter === "all"
          ? true
          : getYear(x.decisionDate) === Number(yearFilter)
      );
  }, [disciplines, soldierId, disciplineType, yearFilter]);

  // Xuất PDF
  const exportPDF = () => {
    const isAwards = tab === 0;
    const items = isAwards ? filteredAwards : filteredDisciplines;
    const rows = items
      .map(
        (it) => `
      <tr>
        <td>${
          isAwards
            ? findLabel(AWARD_TYPES, it.type)
            : findLabel(DISCIPLINE_TYPES, it.type)
        }</td>
        <td>${it.title || ""}</td>
        <td>${isAwards ? it.reason || "" : it.violation || ""}</td>
        <td>${it.issuer || ""}</td>
        <td>${joinNonEmpty(
          [it.decisionNo, it.decisionDate ? fmtDate(it.decisionDate) : ""],
          " • "
        )}</td>
        <td>${it.note ? it.note.replace(/</g, "&lt;") : ""}</td>
      </tr>
    `
      )
      .join("");

    const title = isAwards ? "Khen thưởng" : "Kỷ luật";
    const filterText = [
      `Năm: ${yearFilter === "all" ? "Tất cả" : yearFilter}`,
      isAwards
        ? `Loại: ${
            awardType === "all" ? "Tất cả" : findLabel(AWARD_TYPES, awardType)
          }`
        : `Loại: ${
            disciplineType === "all"
              ? "Tất cả"
              : findLabel(DISCIPLINE_TYPES, disciplineType)
          }`,
    ].join(" • ");

    const win = window.open("", "_blank");
    win.document.write(`
      <html>
      <head>
        <meta charset="utf-8"/>
        <title>${title}</title>
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
        <h1>${title}</h1>
        <div class="meta">Xuất lúc: ${formatDateTime(
          new Date().toISOString()
        )} — ${filterText}</div>
        <table>
          <thead>
            <tr>
              <th>Loại</th>
              <th>Tiêu đề</th>
              <th>${isAwards ? "Lý do" : "Hành vi vi phạm"}</th>
              <th>Cơ quan/Người ban hành</th>
              <th>Quyết định</th>
              <th>Ghi chú</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
        <script>
          window.onload = () => { window.print(); setTimeout(() => window.close(), 300); };
        </script>
      </body>
      </html>
    `);
    win.document.close();
  };

  // Mở dialog thêm mới
  const openCreate = () => {
    setForm(
      tab === 0
        ? { kind: "award", type: "commendation" }
        : { kind: "discipline", type: "reprimand" }
    );
    setOpen(true);
  };

  // Lưu (tạo/cập nhật)
  const handleSubmit = () => {
    // Kiểm tra bắt buộc
    const required = ["type", "title", "decisionDate"];
    for (const k of required) {
      if (!form[k]) {
        alert(
          "Vui lòng điền đủ các trường bắt buộc: Loại, Tiêu đề, Ngày quyết định"
        );
        return;
      }
    }

    if (form.kind === "award") {
      if (form._id) {
        const next = awards.map((x) =>
          x._id === form._id ? { ...x, ...form } : x
        );
        persistAwards(next);
      } else {
        const newItem = { ...form, _id: genId("aw"), soldierId };
        persistAwards([newItem, ...awards]);
      }
    } else {
      if (form._id) {
        const next = disciplines.map((x) =>
          x._id === form._id ? { ...x, ...form } : x
        );
        persistDisciplines(next);
      } else {
        const newItem = { ...form, _id: genId("dl"), soldierId };
        persistDisciplines([newItem, ...disciplines]);
      }
    }

    setOpen(false);
    setForm({});
  };

  // Xoá
  const handleDelete = (id) => {
    if (tab === 0) {
      persistAwards(awards.filter((x) => x._id !== id));
    } else {
      persistDisciplines(disciplines.filter((x) => x._id !== id));
    }
  };

  // Bảng hiển thị
  const renderTable = (isAwards) => {
    const rows = isAwards ? filteredAwards : filteredDisciplines;
    return (
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell sx={{ width: 160 }}>Loại</TableCell>
            <TableCell>Tiêu đề</TableCell>
            <TableCell sx={{ width: 240 }}>
              {isAwards ? "Lý do" : "Hành vi vi phạm"}
            </TableCell>
            <TableCell sx={{ width: 200 }}>Cơ quan/Người ban hành</TableCell>
            <TableCell sx={{ width: 220 }}>Quyết định</TableCell>
            <TableCell>Ghi chú</TableCell>
            <TableCell align="right" sx={{ width: 100 }}>
              Hành động
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((it) => (
            <TableRow key={it._id}>
              <TableCell>
                {isAwards
                  ? findLabel(AWARD_TYPES, it.type)
                  : findLabel(DISCIPLINE_TYPES, it.type)}
              </TableCell>
              <TableCell>{it.title}</TableCell>
              <TableCell>
                {truncate(isAwards ? it.reason : it.violation, 100)}
              </TableCell>
              <TableCell>{it.issuer}</TableCell>
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
                    setForm({ ...it, kind: isAwards ? "award" : "discipline" });
                    setOpen(true);
                  }}
                >
                  <EditIcon />
                </IconButton>
                <IconButton color="error" onClick={() => handleDelete(it._id)}>
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                sx={{ color: "text.secondary", fontStyle: "italic" }}
              >
                Không có bản ghi phù hợp bộ lọc.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    );
  };

  // Form chung cho cả khen thưởng/kỷ luật
  const isAwardsTab = tab === 0;
  const TYPE_OPTIONS = isAwardsTab ? AWARD_TYPES : DISCIPLINE_TYPES;

  return (
    <Card>
      <CardContent>
        {/* Header */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={1.5}
        >
          <Typography variant="h6">Khen thưởng & Kỷ luật</Typography>
          <Stack direction="row" spacing={1} alignItems="center">
            <FormControl size="small" sx={{ minWidth: 120 }}>
              <InputLabel>Năm</InputLabel>
              <Select
                label="Năm"
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
              >
                {YEAR_OPTIONS.map((y) => (
                  <MenuItem key={y} value={y}>
                    {y === "all" ? "Tất cả" : y}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {isAwardsTab ? (
              <ToggleButtonGroup
                size="small"
                value={awardType}
                exclusive
                onChange={(_, v) => setAwardType(v || "all")}
              >
                <ToggleButton value="all">Tất cả KT</ToggleButton>
                {AWARD_TYPES.map((t) => (
                  <ToggleButton key={t.value} value={t.value}>
                    {t.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            ) : (
              <ToggleButtonGroup
                size="small"
                value={disciplineType}
                exclusive
                onChange={(_, v) => setDisciplineType(v || "all")}
              >
                <ToggleButton value="all">Tất cả KL</ToggleButton>
                {DISCIPLINE_TYPES.map((t) => (
                  <ToggleButton key={t.value} value={t.value}>
                    {t.label}
                  </ToggleButton>
                ))}
              </ToggleButtonGroup>
            )}

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
              onClick={openCreate}
            >
              Thêm mới
            </Button>
          </Stack>
        </Stack>

        {/* Tabs */}
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 2 }}>
          <Tab label="Khen thưởng" />
          <Tab label="Kỷ luật" />
        </Tabs>

        {/* Tables */}
        {tab === 0 ? renderTable(true) : renderTable(false)}

        {/* Dialog thêm/sửa */}
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>
            {form._id ? "Cập nhật" : "Thêm mới"}{" "}
            {form.kind === "discipline" ? "kỷ luật" : "khen thưởng"}
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
                  {TYPE_OPTIONS.map((t) => (
                    <MenuItem key={t.value} value={t.value}>
                      {t.label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Tiêu đề"
                value={form.title || ""}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                fullWidth
              />

              {form.kind === "discipline" ? (
                <TextField
                  label="Hành vi vi phạm"
                  value={form.violation || ""}
                  onChange={(e) =>
                    setForm({ ...form, violation: e.target.value })
                  }
                  fullWidth
                />
              ) : (
                <TextField
                  label="Lý do"
                  value={form.reason || ""}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  fullWidth
                />
              )}

              <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
                <TextField
                  label="Cơ quan/Người ban hành"
                  value={form.issuer || ""}
                  onChange={(e) => setForm({ ...form, issuer: e.target.value })}
                  fullWidth
                />
                <TextField
                  label="Số quyết định"
                  value={form.decisionNo || ""}
                  onChange={(e) =>
                    setForm({ ...form, decisionNo: e.target.value })
                  }
                  fullWidth
                />
              </Stack>

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
                fullWidth
              />

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
